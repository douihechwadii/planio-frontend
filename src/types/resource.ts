export type ResourceStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'

export interface Resource {
  id: number
  fullName: string
  role: string
  email: string
  status: ResourceStatus
}

export interface ResourceMetrics {
  month: string         // 'YYYY-MM'
  workingDays: number   // WK
  absenceDays: number   // AD
  availableDays: number // AV
  assignedDays: number  // AS
  remainingDays: number // RD
}

export interface ResourceRequest {
  fullName: string
  role: string
  email: string
  status?: ResourceStatus
}

export interface MonthlyAbsenceRequest {
  month: string         // 'YYYY-MM'
  absenceDays: number
}