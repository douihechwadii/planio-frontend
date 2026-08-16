import api from '@/lib/axios'
import { ClientSummary, ClientDetail, ClientRequest } from '@/types/client'

export const clientService = {
  findAll: async (): Promise<ClientSummary[]> => {
    const { data } = await api.get<ClientSummary[]>('/api/clients')
    return data
  },

  findById: async (id: number): Promise<ClientDetail> => {
    const { data } = await api.get<ClientDetail>(`/api/clients/${id}`)
    return data
  },

  create: async (req: ClientRequest): Promise<ClientDetail> => {
    const { data } = await api.post<ClientDetail>('/api/clients', req)
    return data
  },

  update: async (id: number, req: ClientRequest): Promise<ClientDetail> => {
    const { data } = await api.put<ClientDetail>(`/api/clients/${id}`, req)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/clients/${id}`)
  },
}