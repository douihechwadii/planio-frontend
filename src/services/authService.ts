import api from '@/lib/axios'
import { AuthRequest, AuthResponse } from '@/types/auth'

export const authService = {
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
}