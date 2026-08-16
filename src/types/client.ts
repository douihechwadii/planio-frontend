export type ClientStatus = 'ACTIVE' | 'INACTIVE'

export interface ClientSummary {
  id: number
  name: string
  code: string
  industry: string | null
  status: ClientStatus
  totalActiveProjects: number
}

export interface ClientDetail {
  id: number
  name: string
  code: string
  industry: string | null
  status: ClientStatus
  accountManagerName: string | null
  accountManagerEmail: string | null
  startDate: string | null   // 'YYYY-MM-DD'
  endDate: string | null
  contract: string | null
  product: string | null
  countries: string[]
  totalActiveProjects: number
  totalAllocatedResources: number
}

export interface ClientRequest {
  name: string
  code: string
  industry: string | null
  status: ClientStatus
  accountManagerName: string | null
  accountManagerEmail: string | null
  startDate: string | null
  endDate: string | null
  contract: string | null
  product: string | null
  countries: string[]
}