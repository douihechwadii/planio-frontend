import api from '@/lib/axios'
import { Sandbox, SandboxSummary, SimulationResult, CreateSandboxRequest, UpdateSandboxPicksRequest, ApplyResult } from '@/types/sandbox'

export const sandboxService = {
    findAll: async (): Promise<SandboxSummary[]> => {
        const { data } = await api.get<SandboxSummary[]>('/api/sandboxes')
        return data
    },

    findById: async (id: number): Promise<Sandbox> => {
        const { data } = await api.get<Sandbox>(`/api/sandboxes/${id}`)
        return data
    },

    create: async (req: CreateSandboxRequest): Promise<Sandbox> => {
        const { data } = await api.post<Sandbox>('/api/sandboxes', req)
        return data
    },

    getAvailableMonths: async (id: number): Promise<string[]> => {
        const { data } = await api.get<string[]>(`/api/sandboxes/${id}/available-months`)
        return data
    },

    getAvailableDays: async (id: number, resourceId: number): Promise<Record<string, number>> => {
        const { data } = await api.get<Record<string, number>>(`/api/sandboxes/${id}/resources/${resourceId}/available-days`)
        return data
    },

    updatePicks: async (id: number, req: UpdateSandboxPicksRequest): Promise<Sandbox> => {
        const { data } = await api.put<Sandbox>(`/api/sandboxes/${id}/picks`,req)
        return data
    },

    simulate: async (id: number): Promise<SimulationResult> => {
        const { data } = await api.post<SimulationResult>(`/api/sandboxes/${id}/simulate`)
        return data
    },

    save: async (id: number): Promise<Sandbox> => {
        const { data } = await api.post<Sandbox>(`/api/sandboxes/${id}/save`)
        return data
    },

    discard: async (id: number): Promise<void> => {
        await api.delete(`/api/sandboxes/${id}`)
    },

    apply: async (id: number): Promise<ApplyResult> => {
        const { data } = await api.post<ApplyResult>(`/api/sandboxes/${id}/apply`)
        return data
    },
}