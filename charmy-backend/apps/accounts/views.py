import hmac
import hashlib
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
from .payment_service import LemonSqueezyService
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

class CreateCheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan = request.data.get('plan')
        if plan not in ('monthly', 'yearly', 'pack'):
            return Response({'error': 'Plan invalide.'}, status=400)

        from django.conf import settings
        checkout_url = LemonSqueezyService.create_checkout(
            user=request.user,
            plan=plan,
            success_url=f"{settings.FRONTEND_URL}/premium/success",
            cancel_url=f"{settings.FRONTEND_URL}/premium",
        )
        return Response({'checkout_url': checkout_url})


@method_decorator(csrf_exempt, name='dispatch')
class LemonSqueezyWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        signature = request.META.get('HTTP_X_SIGNATURE', '')

        # Vérifier la signature
        if not LemonSqueezyService.verify_webhook(payload, signature):
            return HttpResponse(status=400)

        import json
        data = json.loads(payload)
        event_name = data.get('meta', {}).get('event_name', '')
        custom_data = data.get('meta', {}).get('custom_data', {})

        print(f"📨 Webhook LemonSqueezy : {event_name}")

        user_id = custom_data.get('user_id')
        plan = custom_data.get('plan')

        # Commande complétée (one-time ou abonnement)
        if event_name in ('order_created', 'subscription_created'):
            # Log tout pour voir ce qu'on reçoit
            print(f"📦 custom_data reçu : {custom_data}")
            print(f"📦 meta complet : {data.get('meta', {})}")
            
            user_id = custom_data.get('user_id')
            plan = custom_data.get('plan')
            print(f"👤 user_id: {user_id} | plan: {plan}")

        # Abonnement annulé
        elif event_name in ('subscription_cancelled', 'subscription_expired'):
            try:
                user = User.objects.get(id=user_id)
                LemonSqueezyService.deactivate_premium(user)
                print(f"❌ Premium annulé pour {user.email}")
            except User.DoesNotExist:
                pass

        # Renouvellement
        elif event_name == 'subscription_payment_success':
            try:
                user = User.objects.get(id=user_id)
                from datetime import timedelta
                from django.utils import timezone
                user.premium_until = timezone.now() + timedelta(days=30)
                user.save(update_fields=['premium_until'])
                print(f"🔄 Premium renouvelé pour {user.email}")
            except User.DoesNotExist:
                pass

        return HttpResponse(status=200)