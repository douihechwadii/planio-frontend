export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface Project {
  id: number
  name: string
  client: string
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
  client: string
  kickoffDate: string
  goLiveDate: string
  status?: ProjectStatus
}

export interface UpdateMonthlyPlanRequest {
  month: string
  daysPlanned: number
}