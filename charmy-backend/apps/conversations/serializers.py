from rest_framework import serializers
from .models import ConversationSession, AISuggestion

class AISuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISuggestion
        fields = [
            'id', 'message_text', 'strategy_explanation',
            'tone_used', 'was_used', 'user_rating', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


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
