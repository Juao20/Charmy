from apps.relations.models import Relation

RELATION_TYPE_LABELS = {
    'romantic': 'relation amoureuse / séduction',
    'friendship': 'amitié',
    'professional': 'relation professionnelle',
    'family': 'relation familiale',
    'reconciliation': 'réconciliation',
}

TONE_LABELS = {
    'playful': 'joueur et humoristique',
    'tender': 'tendre et doux',
    'direct': 'direct et franc',
    'formal': 'formel et professionnel',
    'flirty': 'flirty et séducteur',
}

SYSTEM_PROMPT = """Tu es Charmy, un assistant expert en communication relationnelle et séduction.
Tu aides les gens à mieux communiquer avec les personnes qui comptent pour eux.
Tu génères toujours exactement 3 suggestions de messages, chacune avec une stratégie différente.
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans texte avant ou après.
"""

def build_suggestion_prompt(relation: Relation, raw_input: str) -> list:
    relation_type = RELATION_TYPE_LABELS.get(relation.relation_type, relation.relation_type)
    tone = TONE_LABELS.get(relation.tone, relation.tone)

    context_parts = [
        f"Contexte de la relation :",
        f"- Type : {relation_type}",
        f"- Objectif de l'utilisateur : {relation.goal}",
        f"- Ton préféré : {tone}",
    ]

    if relation.backstory:
        context_parts.append(f"- Historique : {relation.backstory}")

    # ← Bloc strategy ajouté ici
    if relation.strategy:
        context_parts.append(
            f"- Stratégie / approche psychologique IMPORTANTE à respecter : {relation.strategy}"
        )
        context_parts.append(
            f"  ⚠️ Chaque suggestion DOIT impérativement respecter cette stratégie."
        )

    if relation.health_score:
        context_parts.append(f"- Score de santé de la relation : {relation.health_score}/100")

    context = '\n'.join(context_parts)

    user_message = f"""
{context}

Conversation reçue / message à analyser :
\"\"\"
{raw_input}
\"\"\"

Génère exactement 3 suggestions de réponse, chacune avec une approche différente.
Réponds en JSON avec ce format exact :

{{
  "context_summary": "résumé en 1-2 phrases de la dynamique de cette conversation",
  "suggestions": [
    {{
      "message_text": "le message à envoyer",
      "strategy_explanation": "pourquoi cette approche est efficace dans ce contexte",
      "tone_used": "le ton utilisé"
    }},
    {{
      "message_text": "...",
      "strategy_explanation": "...",
      "tone_used": "..."
    }},
    {{
      "message_text": "...",
      "strategy_explanation": "...",
      "tone_used": "..."
    }}
  ]
}}
"""

    return [
        {'role': 'system', 'content': SYSTEM_PROMPT},
        {'role': 'user', 'content': user_message},
    ]