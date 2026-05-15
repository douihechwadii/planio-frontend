import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assignmentService } from '@/services/assignmentService'
import { AssignmentRequest } from '@/types/assignment'
import { resourceKeys }      from '@/hooks/useResources'

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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: AssignmentRequest) => assignmentService.assign(req),
    onSuccess: (_, req) => {
      qc.invalidateQueries({
        queryKey: assignmentKeys.byProject(req.projectId),
      })
      qc.invalidateQueries({
        queryKey: assignmentKeys.byResource(req.resourceId),
      })
      // Refresh resource metrics so AS and RD update immediately
      const year = req.month.slice(0, 4)
      qc.invalidateQueries({
        queryKey: resourceKeys.metrics(req.resourceId, year),
      })
      qc.invalidateQueries({
        queryKey: assignmentKeys.all(),
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