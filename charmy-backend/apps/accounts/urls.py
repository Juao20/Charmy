from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView,
    CreateCheckoutSessionView,
    CreatePortalSessionView,
    StripeWebhookView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
    path('stripe/checkout/', CreateCheckoutSessionView.as_view()),
    path('stripe/portal/', CreatePortalSessionView.as_view()),
    path('stripe/webhook/', StripeWebhookView.as_view()),
]