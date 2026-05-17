import json
import logging
from .ai_client import AIClient
from .prompt_builder import build_suggestion_prompt
from apps.conversations.models import ConversationSession, AISuggestion
from apps.relations.models import Relation

logger = logging.getLogger(__name__)

class CharmyAIService:
    def __init__(self):
        self.client = AIClient()

    def generate_suggestions(self, session: ConversationSession) -> list:
        relation = session.relation

        messages = build_suggestion_prompt(relation, session.raw_input)

        try:
            raw_response = self.client.chat(messages)
            data = json.loads(raw_response)
        except json.JSONDecodeError:
            logger.error(f"Grok a retourné un JSON invalide : {raw_response}")
            raise ValueError("L'IA n'a pas retourné un format valide. Réessaie.")
        except Exception as e:
            logger.error(f"Erreur Grok API : {e}")
            raise

        # Sauvegarder le résumé de contexte sur la session
        session.context_summary = data.get('context_summary', '')
        session.save(update_fields=['context_summary'])

        # Créer les suggestions en base
        suggestions = []
        for item in data.get('suggestions', []):
            suggestion = AISuggestion.objects.create(
                session=session,
                message_text=item['message_text'],
                strategy_explanation=item['strategy_explanation'],
                tone_used=item['tone_used'],
            )
            suggestions.append(suggestion)

        # Mettre à jour last_interaction sur la relation
        from django.utils import timezone
        relation.last_interaction = timezone.now()
        relation.save(update_fields=['last_interaction'])

        return suggestions