import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import { FteSnapshotRequest } from '@/types/dashboard'

export const dashboardKeys = {
    dashboard: (year: string, projectId?: number) => ['dashboard', year, projectId ?? 'all'] as const,
    workload:  (month: string, projectId?: number) => ['dashboard', 'workload', month, projectId ?? 'all'] as const,
    alerts:    (year: string) => ['dashboard', 'alerts', year] as const,
}

export function useDashboard(year: string, projectId?: number) {
    const from = `${year}-01`
    const to   = `${year}-12`
    return useQuery({
        queryKey: dashboardKeys.dashboard(year, projectId),
        queryFn:  () => dashboardService.getDashboard(from, to, projectId),
        enabled:  !!year,
    })
}

export function useWorkload(month: string, projectId?: number) {
    return useQuery({
        queryKey: dashboardKeys.workload(month, projectId),
        queryFn:  () => dashboardService.getWorkload(month, projectId),
        enabled:  !!month,
    })
}

// All alert months for the year
export function useAlerts(year: string) {
    const from = `${year}-01`
    const to   = `${year}-12`
    return useQuery({
        queryKey: dashboardKeys.alerts(year),
        queryFn:  () => dashboardService.getAlerts(from, to),
        enabled:  !!year,
    })
}

// Set FTE Forecast — invalidates dashboard + alerts on success
export function useSetFteForecast(year: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (req: FteSnapshotRequest) =>
            dashboardService.setFteForecast(req),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: dashboardKeys.dashboard(year) })
            qc.invalidateQueries({ queryKey: dashboardKeys.alerts(year) })
        },
    })
}

