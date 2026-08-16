import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '@/services/clientService'
import { ClientRequest } from '@/types/client'

export const clientKeys = {
  all:    ['clients'] as const,
  detail: (id: number) => ['clients', id] as const,
}

export function useClients() {
  return useQuery({
    queryKey: clientKeys.all,
    queryFn:  clientService.findAll,
  })
}

export function useClient(id: number) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn:  () => clientService.findById(id),
    enabled:  !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ClientRequest) => clientService.create(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}

export function useUpdateClient(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: ClientRequest) => clientService.update(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all })
      qc.invalidateQueries({ queryKey: clientKeys.detail(id) })
      // Project list/detail embed client summaries — they're stale now too
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => clientService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all })
    },
  })
}