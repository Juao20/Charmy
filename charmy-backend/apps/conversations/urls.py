from django.urls import path
from .views import (
    ConversationSessionCreateView,
    SessionSuggestionsView,
    SessionHistoryView,
    RateSuggestionView,
    UsageStatusView,
)

urlpatterns = [
    path('sessions/', ConversationSessionCreateView.as_view()),
    path('sessions/<uuid:session_id>/suggestions/', SessionSuggestionsView.as_view()),
    path('relations/<uuid:relation_id>/history/', SessionHistoryView.as_view()),
    path('suggestions/<uuid:pk>/rate/', RateSuggestionView.as_view()),
    path('usage/', UsageStatusView.as_view()),
]