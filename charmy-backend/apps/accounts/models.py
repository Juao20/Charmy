from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)  # ← nouveau
    suggestions_credits = models.IntegerField(default=0)  # crédits pack
    daily_suggestions_used = models.IntegerField(default=0)  # compteur quotidien
    last_reset_date = models.DateField(null=True, blank=True)  # reset chaque jour
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class Subscription(models.Model):
    """Historique des abonnements Stripe."""
    PLAN_CHOICES = [
        ('monthly', 'Mensuel'),
        ('yearly', 'Annuel'),
        ('pack', 'Pack Situations'),
    ]
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('canceled', 'Annulé'),
        ('expired', 'Expiré'),
        ('past_due', 'En retard'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    current_period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} — {self.plan} ({self.status})"