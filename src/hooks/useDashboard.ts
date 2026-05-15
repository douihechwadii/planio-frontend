import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import { FteSnapshotRequest } from '@/types/dashboard'

export const dashboardKeys = {
    dashboard: (year: string) => ['dashboard', year]          as const,
    workload:  (month: string) => ['dashboard', 'workload', month] as const,
    alerts:    (year: string) => ['dashboard', 'alerts', year] as const,
}

// Full-year dashboard — all 8 FTE metrics per month
export function useDashboard(year: string) {
    const from = `${year}-01`
    const to   = `${year}-12`
    return useQuery({
        queryKey: dashboardKeys.dashboard(year),
        queryFn:  () => dashboardService.getDashboard(from, to),
        enabled:  !!year,
    })
}

// Per-resource workload for one specific month
export function useWorkload(month: string) {
    return useQuery({
        queryKey: dashboardKeys.workload(month),
        queryFn:  () => dashboardService.getWorkload(month),
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