from django.urls import path
from .views import (
    ContactListCreateView, ContactDetailView,
    RelationListCreateView, RelationDetailView,
    RelationJournalListCreateView, JournalListCreateView,
    DashboardStatsView,
)

urlpatterns = [
    path('contacts/', ContactListCreateView.as_view()),
    path('contacts/<uuid:pk>/', ContactDetailView.as_view()),
    path('journal/', JournalListCreateView.as_view()),
    path('stats/dashboard/', DashboardStatsView.as_view()),
    path('', RelationListCreateView.as_view()),
    path('<uuid:pk>/', RelationDetailView.as_view()),
    path('<uuid:relation_id>/journal/', RelationJournalListCreateView.as_view()),
]