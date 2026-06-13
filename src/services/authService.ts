import api from '@/lib/axios'
import { AuthRequest, AuthResponse } from '@/types/auth'

export const authService = {
  register: async (payload: { email: string; password: string }) => {
    const { data } = await api.post('/api/auth/register', payload)
    return data
  },
  
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(
      '/api/auth/login',
      credentials
    )
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
  },

  hasAdmin: async (): Promise<boolean> => {
    const { data } = await api.get('/api/auth/has-admin')
    return data.hasAdmin
  }
}