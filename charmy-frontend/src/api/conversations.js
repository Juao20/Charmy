import api from './axios'

export const createSession = (data) => api.post('/conversations/sessions/', data)
export const getSuggestions = (sessionId) =>
  api.get(`/conversations/sessions/${sessionId}/suggestions/`)
export const rateSuggestion = (id, data) =>
  api.patch(`/conversations/suggestions/${id}/rate/`, data)
export const getUsageStatus = () => api.get('/conversations/usage/')
export const getSessionHistory = (relationId) =>
  api.get(`/conversations/relations/${relationId}/history/`)