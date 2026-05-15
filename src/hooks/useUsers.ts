import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { RegisterUserRequest, UpdateUserRequest } from '@/types/user'

// ── Query keys — centralised to avoid typos ───────────────────────────
export const userKeys = {
  all:        ['users']               as const,
  detail:     (id: number) =>
              ['users', id]            as const,
}

// ── Queries ───────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn:  userService.findAll,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn:  () => userService.findById(id),
    enabled:  !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: RegisterUserRequest) => userService.create(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: UpdateUserRequest) => userService.update(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
      qc.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}