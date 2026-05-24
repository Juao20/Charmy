from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    MeView,
    CreateCheckoutView,
    LemonSqueezyWebhookView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
    path('checkout/', CreateCheckoutView.as_view()),
    path('webhook/lemonsqueezy/', LemonSqueezyWebhookView.as_view()),
]