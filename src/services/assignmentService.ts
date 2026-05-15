import api from '@/lib/axios'
import { Assignment, AssignmentRequest } from '@/types/assignment'

export const assignmentService = {

  // GET /api/assignments/project/:projectId
  findByProject: async (projectId: number): Promise<Assignment[]> => {
    const { data } = await api.get<Assignment[]>(
      `/api/assignments/project/${projectId}`
    )
    return data
  },

  // GET /api/assignments/resource/:resourceId
  findByResource: async (resourceId: number): Promise<Assignment[]> => {
    const { data } = await api.get<Assignment[]>(
      `/api/assignments/resource/${resourceId}`
    )
    return data
  },

  // POST /api/assignments — create or update (upsert)
  assign: async (req: AssignmentRequest): Promise<Assignment> => {
    const { data } = await api.post<Assignment>('/api/assignments', req)
    return data
  },

  // DELETE /api/assignments/:id
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/assignments/${id}`)
  },

  findAll: async (): Promise<Assignment[]> => {
  const { data } = await api.get<Assignment[]>('/api/assignments')
  return data
  },
}