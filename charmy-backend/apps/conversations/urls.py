from django.urls import path
from .views import ConversationSessionCreateView, SessionSuggestionsView, RateSuggestionView

urlpatterns = [
    path('sessions/', ConversationSessionCreateView.as_view(), name='sessions'),
    path('sessions/<uuid:session_id>/suggestions/', SessionSuggestionsView.as_view(), name='suggestions'),
    path('suggestions/<uuid:pk>/rate/', RateSuggestionView.as_view(), name='rate-suggestion'),
]