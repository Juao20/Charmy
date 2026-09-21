from django.db import models
import uuid

class ConversationSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    relation = models.ForeignKey(
        'relations.Relation', on_delete=models.CASCADE, related_name='sessions'
    )
    raw_input = models.TextField()
    context_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.id} — {self.relation}"


class AISuggestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ConversationSession, on_delete=models.CASCADE, related_name='suggestions')
    message_text = models.TextField()
    strategy_explanation = models.TextField()
    tone_used = models.CharField(max_length=50)
    was_used = models.BooleanField(default=False)
    user_rating = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Suggestion pour {self.session}"
