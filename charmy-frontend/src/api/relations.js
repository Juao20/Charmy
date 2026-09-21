import api from './axios'

// Contacts
export const getContacts = () => api.get('/relations/contacts/')
export const createContact = (data) => api.post('/relations/contacts/', data)

// Relations
export const getDashboardStats = () => api.get('/relations/stats/dashboard/')
export const getRelations = () => api.get('/relations/')
export const getRelation = (id) => api.get(`/relations/${id}/`)
export const createRelation = (data) => api.post('/relations/', data)
export const updateRelation = (id, data) => api.put(`/relations/${id}/`, data)
export const deleteRelation = (id) => api.delete(`/relations/${id}/`)
export const updateContact = (id, data) => api.put(`/relations/contacts/${id}/`, data)

// Journal (par relation)
export const getJournal = (relationId) => api.get(`/relations/${relationId}/journal/`)
export const createJournalEntry = (relationId, data) =>
  api.post(`/relations/${relationId}/journal/`, data)

// Journal (global, toutes relations confondues)
export const getAllJournalEntries = () => api.get('/relations/journal/')
export const createJournalEntryGlobal = (data) => api.post('/relations/journal/', data)