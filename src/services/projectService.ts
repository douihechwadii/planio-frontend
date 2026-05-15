import api from '@/lib/axios'
import { Project, MonthlyPlan, ProjectRequest } from '@/types/project'

export const projectService = {

  // GET /api/projects
  findAll: async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/api/projects')
    return data
  },

  // GET /api/projects/:id
  findById: async (id: number): Promise<Project> => {
    const { data } = await api.get<Project>(`/api/projects/${id}`)
    return data
  },

  // GET /api/projects/:id/monthly-plan
  getMonthlyPlan: async (id: number): Promise<MonthlyPlan[]> => {
    const { data } = await api.get<MonthlyPlan[]>(
      `/api/projects/${id}/monthly-plan`
    )
    return data
  },

  // POST /api/projects
  create: async (req: ProjectRequest): Promise<Project> => {
    const { data } = await api.post<Project>('/api/projects', req)
    return data
  },

  // PUT /api/projects/:id
  update: async (id: number, req: ProjectRequest): Promise<Project> => {
    const { data } = await api.put<Project>(`/api/projects/${id}`, req)
    return data
  },

  // DELETE /api/projects/:id
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}`)
  },
}