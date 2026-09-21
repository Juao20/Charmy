from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import ConversationSession, AISuggestion
from .serializers import ConversationSessionSerializer, AISuggestionSerializer
from apps.relations.models import Relation
from apps.ai.service import CharmyAIService

class ConversationSessionCreateView(generics.CreateAPIView):
    serializer_class = ConversationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user

        try:
            relation = Relation.objects.get(
                id=request.data.get('relation'),
                user=user
            )
        except Relation.DoesNotExist:
            return Response({'error': 'Relation introuvable.'}, status=404)

        session = ConversationSession.objects.create(
            relation=relation,
            raw_input=request.data.get('raw_input', ''),
        )

        # Appel IA
        try:
            ai_service = CharmyAIService()
            ai_service.generate_suggestions(session)
        except ValueError as e:
            session.delete()
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        serializer = ConversationSessionSerializer(
            session,
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SessionSuggestionsView(generics.ListAPIView):
    serializer_class = AISuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AISuggestion.objects.filter(
            session_id=self.kwargs['session_id'],
            session__relation__user=self.request.user
        )

    def get_serializer_context(self):
        return {'request': self.request}


class SessionHistoryView(generics.ListAPIView):
    serializer_class = ConversationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        relation_id = self.kwargs.get('relation_id')
        return ConversationSession.objects.filter(
            relation__user=self.request.user,
            relation_id=relation_id,
        ).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}


class RateSuggestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            suggestion = AISuggestion.objects.get(
                pk=pk,
                session__relation__user=request.user
            )
        except AISuggestion.DoesNotExist:
            return Response({'error': 'Introuvable.'}, status=404)

        suggestion.user_rating = request.data.get('rating')
        suggestion.was_used = request.data.get('was_used', suggestion.was_used)
        suggestion.save()
        return Response(AISuggestionSerializer(
            suggestion, context={'request': request}
        ).data)
