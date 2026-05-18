import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assignmentService } from '@/services/assignmentService'
import { AssignmentRequest } from '@/types/assignment'
import { resourceKeys }      from '@/hooks/useResources'
import { dashboardKeys } from './useDashboard'

export const assignmentKeys = {
  all:        ()             => ['assignments'] as const,
  byProject:  (pid: number) => ['assignments', 'project',  pid] as const,
  byResource: (rid: number) => ['assignments', 'resource', rid] as const,
}

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.all(),
    queryFn: () => assignmentService.findAll(),
  })
}

export function useAssignmentsByProject(projectId?: number) {
  return useQuery({
    queryKey: ['assignments', 'project', projectId],
    queryFn: () => assignmentService.findByProject(projectId!),
    enabled: !!projectId,
  })
}

export function useAssignmentsByResource(resourceId?: number) {
  return useQuery({
    queryKey: ['assignments', 'resource', resourceId],
    queryFn: () => assignmentService.findByResource(resourceId!),
    enabled: !!resourceId,
  })
}

export function useAssign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignmentService.assign,

    onSuccess: (_data, variables) => {
      // Refresh assignment-related queries if you already have them
      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      })

      // Refresh workload table for the affected month
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.workload(variables.month),
      })

      // Optional: refresh dashboard and alerts for the affected year
      const year = variables.month.substring(0, 4)

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.dashboard(year),
      })

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.alerts(year),
      })
    },
  })
}

export function useDeleteAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => assignmentService.delete(id),
    onSuccess: () => {
      // Invalidate all assignment and resource metric queries
      qc.invalidateQueries({ queryKey: ['assignments'] })
      qc.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}