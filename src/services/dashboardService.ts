import api from '@/lib/axios'
import {
    MonthlyCapacity,
    ResourceWorkload,
    Alert,
    FteSnapshotRequest,
} from '@/types/dashboard'

export const dashboardService = {

    // GET /api/dashboard?from=YYYY-MM&to=YYYY-MM
    getDashboard: async (
        from: string,
        to: string
    ): Promise<MonthlyCapacity[]> => {
        const { data } = await api.get<MonthlyCapacity[]>('/api/dashboard', {
            params: { from, to },
        })
        return data
    },

    // GET /api/dashboard/workload?month=YYYY-MM
    getWorkload: async (month: string): Promise<ResourceWorkload[]> => {
        const { data } = await api.get<ResourceWorkload[]>(
            '/api/dashboard/workload',
            { params: { month } }
        )
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