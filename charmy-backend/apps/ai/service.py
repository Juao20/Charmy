import json
import logging
from .ai_client import AIClient
from .prompt_builder import build_suggestion_prompt
from apps.conversations.models import ConversationSession, AISuggestion
from django.utils import timezone

logger = logging.getLogger(__name__)

class CharmyAIService:
    def __init__(self):
        self.client = AIClient()

    def generate_suggestions(self, session: ConversationSession) -> list:
        relation = session.relation
        messages = build_suggestion_prompt(relation, session.raw_input)

        try:
            raw_response = self.client.chat(messages)
        except Exception as e:
            logger.error(f"Erreur API IA : {e}")
            raise ValueError("Charmy n'a pas pu joindre l'IA. Réessaie dans un instant.")

        try:
            data = json.loads(raw_response)
        except json.JSONDecodeError:
            logger.error(f"JSON invalide : {raw_response}")
            raise ValueError("L'IA n'a pas retourné un format valide. Réessaie.")

        session.context_summary = data.get('context_summary', '')
        session.save(update_fields=['context_summary'])

        suggestions = []
        items = data.get('suggestions', [])
        try:
            for item in items:
                suggestion = AISuggestion.objects.create(
                    session=session,
                    message_text=item['message_text'],
                    strategy_explanation=item['strategy_explanation'],
                    tone_used=item['tone_used'],
                )
                suggestions.append(suggestion)
        except KeyError:
            logger.error(f"Suggestion incomplète dans la réponse IA : {items}")
            raise ValueError("L'IA n'a pas retourné un format valide. Réessaie.")

        if not suggestions:
            raise ValueError("L'IA n'a retourné aucune suggestion. Réessaie.")

        relation.last_interaction = timezone.now()
        relation.save(update_fields=['last_interaction'])

        return suggestions