import stripe
from .models import User
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .stripe_service import StripeService
from datetime import datetime
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan = request.data.get('plan')
        if plan not in ('monthly', 'yearly', 'pack'):
            return Response({'error': 'Plan invalide.'}, status=400)

        session = StripeService.create_checkout_session(
            user=request.user,
            plan=plan,
            success_url='http://localhost:5173/premium/success',
            cancel_url='http://localhost:5173/premium',
        )
        return Response({'checkout_url': session.url})


class CreatePortalSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session = StripeService.create_portal_session(
            user=request.user,
            return_url='http://localhost:5173/profile',
        )
        return Response({'portal_url': session.url})


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return HttpResponse(status=400)

        data = event['data']['object']

        # Convertir l'objet Stripe en dict Python — c'est le fix principal
        if hasattr(data, 'to_dict'):
            data = data.to_dict()
        elif hasattr(data, '_data'):
            data = dict(data._data)

        event_type = event['type']
        print(f"📨 Webhook reçu : {event_type}")

        # Abonnement activé
        if event_type == 'checkout.session.completed':
            metadata = data.get('metadata', {})
            user_id = metadata.get('user_id')
            plan = metadata.get('plan')
            print(f"👤 User ID: {user_id} | Plan: {plan}")

            try:
                user = User.objects.get(id=user_id)
                StripeService.activate_premium(
                    user=user,
                    plan=plan,
                    subscription_id=data.get('subscription', ''),
                    payment_intent_id=data.get('payment_intent', ''),
                    period_end=None,
                )
                print(f"✅ Premium activé pour {user.email}")
            except User.DoesNotExist:
                print(f"❌ User {user_id} introuvable")

        # Renouvellement
        elif event_type == 'invoice.payment_succeeded':
            subscription_id = data.get('subscription')
            if subscription_id:
                try:
                    sub = stripe.Subscription.retrieve(subscription_id)
                    sub_dict = sub.to_dict() if hasattr(sub, 'to_dict') else dict(sub)
                    user_id = sub_dict.get('metadata', {}).get('user_id')
                    if user_id:
                        user = User.objects.get(id=user_id)
                        from datetime import datetime
                        user.premium_until = datetime.fromtimestamp(
                            sub_dict['current_period_end'], tz=timezone.utc
                        )
                        user.save(update_fields=['premium_until'])
                        print(f"🔄 Premium renouvelé pour {user.email}")
                except User.DoesNotExist:
                    pass

        # Annulation
        elif event_type in ('customer.subscription.deleted', 'customer.subscription.paused'):
            subscription_id = data.get('id')
            try:
                sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
                StripeService.deactivate_premium(sub.user)
                print(f"❌ Premium annulé pour {sub.user.email}")
            except Subscription.DoesNotExist:
                pass

        return HttpResponse(status=200)