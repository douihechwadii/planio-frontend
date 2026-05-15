import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceService } from '@/services/resourceService'
import { ResourceRequest, MonthlyAbsenceRequest } from '@/types/resource'

export const resourceKeys = {
  all:     ['resources']                          as const,
  active:  ['resources', 'active']               as const,
  detail:  (id: number) => ['resources', id]     as const,
  metrics: (id: number, year: string) =>
           ['resources', id, 'metrics', year]    as const,
}

// ── Queries ───────────────────────────────────────────────────────────

export function useResources() {
  return useQuery({
    queryKey: resourceKeys.all,
    queryFn:  resourceService.findAll,
  })
}

export function useActiveResources() {
  return useQuery({
    queryKey: resourceKeys.active,
    queryFn:  resourceService.findAllActive,
  })
}

export function useResource(id: number) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn:  () => resourceService.findById(id),
    enabled:  !!id,
  })
}

// Fetches metrics for the full year — year format: '2025'
export function useResourceMetrics(id: number, year: string) {
  const from = `${year}-01`
  const to   = `${year}-12`
  return useQuery({
    queryKey: resourceKeys.metrics(id, year),
    queryFn:  () => resourceService.getMetrics(id, from, to),
    enabled:  !!id && !!year,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────

export function useCreateResource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ResourceRequest) => resourceService.create(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all })
      qc.invalidateQueries({ queryKey: resourceKeys.active })
    },
  })
}

export function useUpdateResource(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ResourceRequest) => resourceService.update(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all })
      qc.invalidateQueries({ queryKey: resourceKeys.detail(id) })
    },
  })
}

export function useDeleteResource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => resourceService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.all })
    },
  })
}

export function useSetAbsence(resourceId: number, year: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: MonthlyAbsenceRequest) =>
      resourceService.setAbsence(resourceId, req),
    onSuccess: () => {
      // Invalidate metrics so the table refreshes with new AD/AV/RD values
      qc.invalidateQueries({
        queryKey: resourceKeys.metrics(resourceId, year),
      })
    },
  })
}