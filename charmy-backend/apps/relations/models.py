from django.db import models
from django.conf import settings
import uuid

class Contact(models.Model):
    """La personne avec qui l'utilisateur veut communiquer."""
    PLATFORM_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('sms', 'SMS'),
        ('other', 'Autre'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='contacts/', null=True, blank=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default='other')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name')

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Relation(models.Model):
    """Le lien entre l'utilisateur et un contact, avec son objectif."""
    RELATION_TYPES = [
        ('romantic', 'Amour / Séduction'),
        ('friendship', 'Amitié'),
        ('professional', 'Professionnel'),
        ('family', 'Famille'),
        ('reconciliation', 'Réconciliation'),
    ]
    TONE_CHOICES = [
        ('playful', 'Joueur / Humoristique'),
        ('tender', 'Tendre / Doux'),
        ('direct', 'Direct / Franc'),
        ('formal', 'Formel / Pro'),
        ('flirty', 'Flirty'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='relations')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='relations')

    relation_type = models.CharField(max_length=20, choices=RELATION_TYPES)
    goal = models.TextField(help_text="Ce que l'utilisateur veut accomplir")
    tone = models.CharField(max_length=20, choices=TONE_CHOICES, default='playful')
    backstory = models.TextField(blank=True, help_text="Historique de la relation")
    strategy = models.TextField(
        blank=True,
        help_text="Approche psychologique : comment l'utilisateur veut se comporter"
    )

    health_score = models.IntegerField(default=50)  # 0-100
    last_interaction = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'contact')

    def __str__(self):
        return f"{self.user.username} → {self.contact.name} ({self.relation_type})"


class RelationJournal(models.Model):
    """Journal des événements clés d'une relation."""
    EVENT_TYPES = [
        ('milestone', 'Étape importante'),
        ('conflict', 'Conflit'),
        ('positive', 'Moment positif'),
        ('note', 'Note libre'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    relation = models.ForeignKey(Relation, on_delete=models.CASCADE, related_name='journal')
    note = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='note')
    event_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.event_type}] {self.relation} — {self.event_date.date()}"