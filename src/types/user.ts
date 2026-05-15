export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: number 
  email: string
  password: string
  role: string
}

export interface RegisterUserRequest {
  email: string
  password: string
}

export interface UpdateUserRequest {
  email: string
  password: string
  role: string
}
