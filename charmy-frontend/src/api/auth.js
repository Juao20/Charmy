import api from './axios'

export const register = (data) => api.post('/auth/register/', data)
export const login = (data) => api.post('/auth/login/', data)
export const getMe = () => api.get('/auth/me/')
export const createCheckoutSession = (plan) =>
  api.post('/auth/stripe/checkout/', { plan })

export const createPortalSession = () =>
  api.post('/auth/stripe/portal/')