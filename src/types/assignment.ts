export interface Assignment {
  id: number
  projectId: number
  projectName: string
  client: string
  resourceId: number
  resourceFullName: string
  resourceRole: string
  month: string         // 'YYYY-MM'
  daysAssigned: number
}

export interface AssignmentRequest {
  projectId: number
  resourceId: number
  month: string         // 'YYYY-MM'
  daysAssigned: number
}