export type SandboxStatus = 'DRAFT' | 'SIMULATED' | 'SAVED' | 'APPLIED'

export interface SandboxPick {
    resourceId: number
    resourceName: string
    month: string // 'YYYY-MM'
    workingDays: number
}

export interface Sandbox {
    id: number
    projectId: number
    projectName: string
    status: SandboxStatus
    resultDirty: boolean
    picks: SandboxPick[]
    lastResult: SimulationResult | null
}

export interface SandboxSummary {
    id: number
    projectName: string
    status: SandboxStatus
    createdAt: string
}

export interface ResourceMonthMetrics {
    month: string
    wk: number
    ad: number
    av: number
    as: number
    rd: number
}

export interface MonthlyPlanLine {
    month: string
    daysPlanned: number
    daysAssigned: number
    assignable: boolean
}

export interface SimulationResult {
    byResource: Record<number, ResourceMonthMetrics[]>
    projectMonthly: MonthlyPlanLine[]
    warnings: string[]
    computedAt: string
}

export interface CreateSandboxRequest {
    projectId: number
}
export interface SandboxPickRequest {
    resourceId: number
    month: string
    workingDays: number
}
export interface UpdateSandboxPicksRequest {
    picks: SandboxPickRequest[]
}

export interface ApplyResult {
    createdOrUpdatedAssignmentIds: number[]
    success: boolean
}