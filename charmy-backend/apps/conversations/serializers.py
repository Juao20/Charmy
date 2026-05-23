from rest_framework import serializers
from .models import ConversationSession, AISuggestion

class AISuggestionSerializer(serializers.ModelSerializer):
    is_locked = serializers.SerializerMethodField()
    message_text = serializers.SerializerMethodField()
    strategy_explanation = serializers.SerializerMethodField()

    class Meta:
        model = AISuggestion
        fields = [
            'id', 'message_text', 'strategy_explanation',
            'tone_used', 'is_premium_only', 'is_locked',
            'was_used', 'user_rating', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def _is_premium_user(self):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return request.user.is_premium or request.user.suggestions_credits > 0
        return False

    def get_is_locked(self, obj):
        """True si la suggestion est premium et l'user n'est pas premium."""
        if not obj.is_premium_only:
            return False
        return not self._is_premium_user()

    def get_message_text(self, obj):
        if obj.is_premium_only and not self._is_premium_user():
            return None  # caché côté backend
        return obj.message_text

    def get_strategy_explanation(self, obj):
        if obj.is_premium_only and not self._is_premium_user():
            return None
        return obj.strategy_explanation


class ConversationSessionSerializer(serializers.ModelSerializer):
    suggestions = serializers.SerializerMethodField()

    class Meta:
        model = ConversationSession
        fields = ['id', 'relation', 'raw_input', 'context_summary', 'suggestions', 'created_at']
        read_only_fields = ['id', 'context_summary', 'created_at']

    def get_suggestions(self, obj):
        return AISuggestionSerializer(
            obj.suggestions.all(),
            many=True,
            context=self.context
        ).data