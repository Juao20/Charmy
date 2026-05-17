import api from './axios'

export const createSession = (data) => api.post('/conversations/sessions/', data)
export const getSuggestions = (sessionId) =>
  api.get(`/conversations/sessions/${sessionId}/suggestions/`)
export const rateSuggestion = (id, data) =>
  api.patch(`/conversations/suggestions/${id}/rate/`, data)