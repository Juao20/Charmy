from django.db import models
import uuid

class ConversationSession(models.Model):
    """Une session = l'utilisateur colle une convo et demande de l'aide."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    relation = models.ForeignKey(
        'relations.Relation', on_delete=models.CASCADE, related_name='sessions'
    )
    raw_input = models.TextField(help_text="La conversation collée par l'utilisateur")
    context_summary = models.TextField(blank=True, help_text="Résumé généré par l'IA")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.id} — {self.relation}"


class AISuggestion(models.Model):
    """Une suggestion de message générée par Grok."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ConversationSession, on_delete=models.CASCADE, related_name='suggestions')
    message_text = models.TextField()
    strategy_explanation = models.TextField(help_text="Pourquoi ce message est efficace")
    tone_used = models.CharField(max_length=50)
    was_used = models.BooleanField(default=False)
    user_rating = models.IntegerField(null=True, blank=True)  # 1-5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Suggestion pour {self.session} — utilisée: {self.was_used}"