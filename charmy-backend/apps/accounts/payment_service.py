import httpx
import hashlib
import hmac
from django.conf import settings
from django.utils import timezone
from datetime import datetime

LEMON_API_URL = 'https://api.lemonsqueezy.com/v1'

VARIANT_MAP = {
    'monthly': settings.LEMONSQUEEZY_VARIANT_MONTHLY,
    'yearly':  settings.LEMONSQUEEZY_VARIANT_YEARLY,
    'pack':    settings.LEMONSQUEEZY_VARIANT_PACK,
}

def get_headers():
    return {
        'Authorization': f'Bearer {settings.LEMONSQUEEZY_API_KEY}',
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    }

class LemonSqueezyService:

    @staticmethod
    def create_checkout(user, plan, success_url, cancel_url):
        """Crée une session de checkout Lemon Squeezy."""
        variant_id = VARIANT_MAP[plan]

        payload = {
            'data': {
                'type': 'checkouts',
                'attributes': {
                    'checkout_data': {
                        'email': user.email,
                        'name': user.username,
                        'custom': {
                            'user_id': str(user.id),
                            'plan': plan,
                        }
                    },
                    'product_options': {
                        'redirect_url': success_url,
                    },
                    'checkout_options': {
                        'embed': False,
                    },
                },
                'relationships': {
                    'store': {
                        'data': {
                            'type': 'stores',
                            'id': str(settings.LEMONSQUEEZY_STORE_ID),
                        }
                    },
                    'variant': {
                        'data': {
                            'type': 'variants',
                            'id': str(variant_id),
                        }
                    },
                },
            }
        }

        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f'{LEMON_API_URL}/checkouts',
                headers=get_headers(),
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return data['data']['attributes']['url']

    @staticmethod
    def verify_webhook(payload: bytes, signature: str) -> bool:
        """Vérifie la signature du webhook."""
        secret = settings.LEMONSQUEEZY_WEBHOOK_SECRET.encode()
        expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    @staticmethod
    def activate_premium(user, plan, subscription_id='', order_id=''):
        """Active le premium sur l'utilisateur."""
        from .models import Subscription

        user.is_premium = True
        if plan == 'monthly':
            from datetime import timedelta
            user.premium_until = timezone.now() + timedelta(days=30)
        elif plan == 'yearly':
            from datetime import timedelta
            user.premium_until = timezone.now() + timedelta(days=365)

        user.save(update_fields=['is_premium', 'premium_until'])

        Subscription.objects.create(
            user=user,
            stripe_subscription_id=subscription_id,
            stripe_payment_intent_id=order_id,
            plan=plan,
            status='active',
            current_period_end=user.premium_until,
        )

    @staticmethod
    def deactivate_premium(user):
        """Désactive le premium."""
        from .models import Subscription

        user.is_premium = False
        user.premium_until = None
        user.save(update_fields=['is_premium', 'premium_until'])

        Subscription.objects.filter(
            user=user, status='active'
        ).update(status='canceled')