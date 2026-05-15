import api from '@/lib/axios'
import {
  Resource,
  ResourceRequest,
  ResourceMetrics,
  MonthlyAbsenceRequest,
} from '@/types/resource'

export const resourceService = {

  // GET /api/resources
  findAll: async (): Promise<Resource[]> => {
    const { data } = await api.get<Resource[]>('/api/resources')
    return data
  },

  // GET /api/resources/active
  findAllActive: async (): Promise<Resource[]> => {
    const { data } = await api.get<Resource[]>('/api/resources/active')
    return data
  },

  // GET /api/resources/:id
  findById: async (id: number): Promise<Resource> => {
    const { data } = await api.get<Resource>(`/api/resources/${id}`)
    return data
  },

  // GET /api/resources/:id/metrics?from=YYYY-MM&to=YYYY-MM
  getMetrics: async (
    id: number,
    from: string,
    to: string
  ): Promise<ResourceMetrics[]> => {
    const { data } = await api.get<ResourceMetrics[]>(
      `/api/resources/${id}/metrics`,
      { params: { from, to } }
    )
    return data
  },

  // POST /api/resources
  create: async (req: ResourceRequest): Promise<Resource> => {
    const { data } = await api.post<Resource>('/api/resources', req)
    return data
  },

  // PUT /api/resources/:id
  update: async (id: number, req: ResourceRequest): Promise<Resource> => {
    const { data } = await api.put<Resource>(`/api/resources/${id}`, req)
    return data
  },

  // DELETE /api/resources/:id
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/resources/${id}`)
  },

  // PUT /api/resources/:id/absences — upsert absence days for a month
  setAbsence: async (
    id: number,
    req: MonthlyAbsenceRequest
  ): Promise<void> => {
    await api.put(`/api/resources/${id}/absences`, req)
  },

  // DELETE /api/resources/:id/absences/:month
  deleteAbsence: async (id: number, month: string): Promise<void> => {
    await api.delete(`/api/resources/${id}/absences/${month}`)
  },
}