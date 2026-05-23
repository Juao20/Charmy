from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import ConversationSession, AISuggestion
from .serializers import ConversationSessionSerializer, AISuggestionSerializer
from apps.relations.models import Relation
from apps.ai.service import CharmyAIService

DAILY_FREE_LIMIT = 2  # sessions par jour en mode gratuit

class ConversationSessionCreateView(generics.CreateAPIView):
    serializer_class = ConversationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user

        # Vérifier la limite si pas premium
        if not user.is_premium:
            today = timezone.now().date()

            # Reset quotidien
            if user.last_reset_date != today:
                user.daily_suggestions_used = 0
                user.last_reset_date = today
                user.save(update_fields=['daily_suggestions_used', 'last_reset_date'])

            # Vérifier crédits pack
            has_credits = user.suggestions_credits > 0

            # Vérifier limite quotidienne
            if not has_credits and user.daily_suggestions_used >= DAILY_FREE_LIMIT:
                return Response({
                    'error': 'limit_reached',
                    'message': f'Tu as atteint ta limite de {DAILY_FREE_LIMIT} sessions aujourd\'hui.',
                    'daily_used': user.daily_suggestions_used,
                    'daily_limit': DAILY_FREE_LIMIT,
                    'reset_tomorrow': True,
                }, status=status.HTTP_403_FORBIDDEN)

        # Créer la session
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

        # Décrémenter crédits ou incrémenter compteur quotidien
        if not user.is_premium:
            if user.suggestions_credits > 0:
                user.suggestions_credits -= 1
                user.save(update_fields=['suggestions_credits'])
            else:
                user.daily_suggestions_used += 1
                user.save(update_fields=['daily_suggestions_used'])

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
    """Historique des sessions — premium only."""
    serializer_class = ConversationSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_premium:
            return Response({
                'error': 'premium_required',
                'message': "L'historique est réservé aux membres Premium.",
            }, status=status.HTTP_403_FORBIDDEN)
        return super().get(request, *args, **kwargs)

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


class UsageStatusView(APIView):
    """Retourne le statut d'utilisation de l'utilisateur."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        if user.last_reset_date != today:
            daily_used = 0
        else:
            daily_used = user.daily_suggestions_used

        return Response({
            'is_premium': user.is_premium,
            'daily_used': daily_used,
            'daily_limit': DAILY_FREE_LIMIT,
            'sessions_remaining': max(0, DAILY_FREE_LIMIT - daily_used) if not user.is_premium else None,
            'suggestions_credits': user.suggestions_credits,
            'premium_until': user.premium_until,
        })