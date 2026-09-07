import { ClientSummary } from "./client"

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED'

export interface Project {
  id: number
  name: string
  client: ClientSummary
  kickoffDate: string   // 'YYYY-MM-DD'
  goLiveDate: string    // 'YYYY-MM-DD'
  status: ProjectStatus
}

export interface MonthlyPlan {
  id: number
  month: string     // 'YYYY-MM'
  daysPlanned: number   // DP
  daysAssigned: number  // DA
  assignable: boolean
}

export interface ProjectRequest {
  name: string
  clientId: number
  kickoffDate: string
  goLiveDate: string
  status?: ProjectStatus
}

export interface UpdateMonthlyPlanRequest {
  month: string
  daysPlanned: number
}