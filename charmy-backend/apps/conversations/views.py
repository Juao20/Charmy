from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ConversationSession, AISuggestion
from .serializers import ConversationSessionSerializer, AISuggestionSerializer
from apps.relations.models import Relation
from apps.ai.service import CharmyAIService

class ConversationSessionCreateView(generics.CreateAPIView):
    serializer_class = ConversationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        relation = Relation.objects.get(
            id=request.data.get('relation'),
            user=request.user
        )

        session = ConversationSession.objects.create(
            relation=relation,
            raw_input=request.data.get('raw_input', ''),
        )

        # Appel à Grok
        try:
            ai_service = CharmyAIService()
            suggestions = ai_service.generate_suggestions(session)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Retourner la session avec les suggestions déjà générées
        serializer = ConversationSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SessionSuggestionsView(generics.ListAPIView):
    serializer_class = AISuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AISuggestion.objects.filter(
            session_id=self.kwargs['session_id'],
            session__relation__user=self.request.user
        )


class RateSuggestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        suggestion = AISuggestion.objects.get(
            pk=pk,
            session__relation__user=request.user
        )
        suggestion.user_rating = request.data.get('rating')
        suggestion.was_used = request.data.get('was_used', suggestion.was_used)
        suggestion.save()
        return Response(AISuggestionSerializer(suggestion).data)