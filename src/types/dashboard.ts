export interface MonthlyCapacity {
  month: string          // 'YYYY-MM'
  workingDays: number
  daysToplan: number
  fteNeeded: number
  daysAssigned: number
  fteAssigned: number
  fteForecast: number
  fteToAssign: number
  fteAvailability: number
  gap: number
  hasAlert: boolean
}

export interface ResourceWorkload {
  resourceId: number
  fullName: string
  role: string
  month: string
  workingDays: number
  absenceDays: number
  availableDays: number
  assignedDays: number
  remainingDays: number
  utilisationPct: number
}

export interface Alert {
  month: string
  gap: number
  severity: 'WARNING' | 'CRITICAL'
  suggestion: string
}

export interface FteSnapshotRequest {
  month: string
  fteForecast: number
}