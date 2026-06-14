import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { ProjectRequest, MonthlyPlan, UpdateMonthlyPlanRequest } from '@/types/project'

// ── Query keys — centralised to avoid typos ───────────────────────────
export const projectKeys = {
  all:        ['projects']               as const,
  detail:     (id: number) =>
              ['projects', id]            as const,
  monthlyPlan:(id: number) =>
              ['projects', id, 'monthly-plan'] as const,
}

// ── Queries ───────────────────────────────────────────────────────────

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn:  projectService.findAll,
  })
}

export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn:  () => projectService.findById(id),
    enabled:  !!id,
  })
}

export function useMonthlyPlan(projectId: number) {
  return useQuery({
    queryKey: projectKeys.monthlyPlan(projectId),
    queryFn:  () => projectService.getMonthlyPlan(projectId),
    enabled:  !!projectId,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ProjectRequest) => projectService.create(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useUpdateProject(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ProjectRequest) => projectService.update(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

// ── NEW ───────────────────────────────────────────────────────────────
export function useUpdateMonthlyPlans(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (updates: UpdateMonthlyPlanRequest[]) =>
      projectService.updateMonthlyPlans(projectId, updates),

    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey: projectKeys.monthlyPlan(projectId) })
      const previous = qc.getQueryData(projectKeys.monthlyPlan(projectId))

      qc.setQueryData(projectKeys.monthlyPlan(projectId), (old: MonthlyPlan[] | undefined) => {
        if (!old) return old
        return old.map((plan) => {
          const update = updates.find(u => u.month === plan.month)
          return update ? { ...plan, daysPlanned: update.daysPlanned } : plan
        })
      })

      return { previous }
    },

    onError: (_err, _updates, context) => {
      if (context?.previous) {
        qc.setQueryData(projectKeys.monthlyPlan(projectId), context.previous)
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: projectKeys.monthlyPlan(projectId) })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}