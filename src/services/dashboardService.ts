import api from '@/lib/axios'
import {
    MonthlyCapacity,
    ResourceWorkload,
    Alert,
    FteSnapshotRequest,
} from '@/types/dashboard'

export const dashboardService = {

    getDashboard: async (from: string, to: string, projectId?: number): Promise<MonthlyCapacity[]> => {
        const { data } = await api.get<MonthlyCapacity[]>('/api/dashboard', {
            params: { from, to, projectId },
        })
        return data
    },

    getWorkload: async (month: string, projectId?: number): Promise<ResourceWorkload[]> => {
        const { data } = await api.get<ResourceWorkload[]>('/api/dashboard/workload', {
            params: { month, projectId },
        })
        return data
    },

    // GET /api/dashboard/alerts?from=YYYY-MM&to=YYYY-MM
    getAlerts: async (from: string, to: string): Promise<Alert[]> => {
        const { data } = await api.get<Alert[]>('/api/dashboard/alerts', {
            params: { from, to },
        })
        return data
    },

    // PUT /api/dashboard/fte-forecast
    setFteForecast: async (req: FteSnapshotRequest): Promise<void> => {
        await api.put('/api/dashboard/fte-forecast', req)
    },

    
}