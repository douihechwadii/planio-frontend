import api from '@/lib/axios'
import { UpdateUserRequest, User, RegisterUserRequest } from '@/types/user'

export const userService = {

  // GET /api/admin/users
  findAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/api/admin/users')
    return data
  },

  // GET /api/projects/:id
  findById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/api/admin/users/${id}`)
    return data
  },

  // POST /api/auth/register
  create: async (req: RegisterUserRequest): Promise<User> => {
    const { data } = await api.post<User>('/api/auth/register', req)
    return data
  },

  // PUT /api/admin/users/:id
  update: async (id: number, req: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<User>(`/api/admin/users/${id}`, req)
    return data
  },

  // DELETE /api/admin/users/:id
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`)
  },
}