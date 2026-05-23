import stripe
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import os

stripe.api_key = settings.STRIPE_SECRET_KEY

PRICE_MAP = {
    'monthly': settings.STRIPE_PRICE_MONTHLY,
    'yearly':  settings.STRIPE_PRICE_YEARLY,
    'pack':    settings.STRIPE_PRICE_PACK,
}

success_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173') + '/premium/success',
cancel_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173') + '/premium',

class StripeService:

    @staticmethod
    def get_or_create_customer(user):
        """Récupère ou crée un customer Stripe pour l'utilisateur."""
        if user.stripe_customer_id:
            return stripe.Customer.retrieve(user.stripe_customer_id)

        customer = stripe.Customer.create(
            email=user.email,
            name=user.username,
            metadata={'user_id': str(user.id)},
        )
        user.stripe_customer_id = customer.id
        user.save(update_fields=['stripe_customer_id'])
        return customer

    @staticmethod
    def create_checkout_session(user, plan, success_url, cancel_url):
        """Crée une session Stripe Checkout."""
        customer = StripeService.get_or_create_customer(user)
        price_id = PRICE_MAP[plan]

        is_recurring = plan in ('monthly', 'yearly')

        session = stripe.checkout.Session.create(
            customer=customer.id,
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription' if is_recurring else 'payment',
            success_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173') + '/premium/success',
            cancel_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173') + '/premium',
            metadata={
                'user_id': str(user.id),
                'plan': plan,
            },
        )
        return session

    @staticmethod
    def create_portal_session(user, return_url):
        """Portail Stripe pour gérer/annuler l'abonnement."""
        customer = StripeService.get_or_create_customer(user)
        session = stripe.billing_portal.Session.create(
            customer=customer.id,
            return_url=return_url,
        )
        return session

    @staticmethod
    def activate_premium(user, plan, subscription_id='', payment_intent_id='', period_end=None):
        """Active le premium sur l'utilisateur."""
        from .models import Subscription

        user.is_premium = True
        if period_end:
            user.premium_until = datetime.fromtimestamp(period_end, tz=timezone.utc)
        user.save(update_fields=['is_premium', 'premium_until'])

        Subscription.objects.create(
            user=user,
            stripe_subscription_id=subscription_id,
            stripe_payment_intent_id=payment_intent_id,
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