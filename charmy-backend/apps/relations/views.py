from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
from apps.conversations.models import ConversationSession, AISuggestion
from rest_framework import generics, permissions
from .models import Contact, Relation, RelationJournal
from .serializers import ContactSerializer, RelationSerializer, RelationJournalSerializer

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        relations = Relation.objects.filter(user=user)
        total_relations = relations.count()

        # Sessions des 7 derniers jours
        last_week = timezone.now() - timedelta(days=7)
        sessions_this_week = ConversationSession.objects.filter(
            relation__user=user,
            created_at__gte=last_week,
        ).count()

        # Suggestions utilisées
        suggestions_used = AISuggestion.objects.filter(
            session__relation__user=user,
            was_used=True,
        ).count()

        # Relation la plus active
        most_active = relations.order_by('-last_interaction').first()

        return Response({
            'total_relations': total_relations,
            'sessions_this_week': sessions_this_week,
            'suggestions_used': suggestions_used,
            'most_active_relation': {
                'id': str(most_active.id),
                'name': most_active.contact.name,
                'last_interaction': most_active.last_interaction,
            } if most_active and most_active.last_interaction else None,
        })

class ContactListCreateView(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)


class RelationListCreateView(generics.ListCreateAPIView):
    serializer_class = RelationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Relation.objects.filter(user=self.request.user).select_related('contact').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RelationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RelationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Relation.objects.filter(user=self.request.user)


class RelationJournalListCreateView(generics.ListCreateAPIView):
    serializer_class = RelationJournalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RelationJournal.objects.filter(
            relation__user=self.request.user,
            relation_id=self.kwargs['relation_id']
        ).order_by('-event_date')

    def perform_create(self, serializer):
        relation = get_object_or_404(
            Relation, id=self.kwargs['relation_id'], user=self.request.user
        )
        serializer.save(relation=relation)