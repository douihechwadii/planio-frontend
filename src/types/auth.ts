export interface AuthRequest {
  email: string
  password: string
  deviceId: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}