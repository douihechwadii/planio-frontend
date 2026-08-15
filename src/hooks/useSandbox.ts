import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sandboxService } from "@/services/sandboxService";
import { CreateSandboxRequest, UpdateSandboxPicksRequest } from "@/types/sandbox";

export const sandboxKeys = {
    all: ['sandboxes'] as const,
    detail: (id: number) => ['sandboxes', id] as const,
    months:(id: number) => ['sandboxes', id, 'available-months'] as const,
    days: (id: number, resourceId: number) => ['sandboxes', id, 'resources', resourceId, 'available-days'] as const,
}

export function useSandboxes() {
    return useQuery({
        queryKey: sandboxKeys.all,
        queryFn: sandboxService.findAll,
    })
}

export function useSandbox(id: number) {
    return useQuery({
        queryKey: sandboxKeys.detail(id),
        queryFn:() => sandboxService.findById(id),
        enabled:!!id,
    })
}

export function useAvailableMonths(id: number) {
    return useQuery({
        queryKey: sandboxKeys.months(id),
        queryFn:() => sandboxService.getAvailableMonths(id),
        enabled:!!id,
    })
}

export function useAvailableDays(id: number, resourceId: number | null) {
    return useQuery({
        queryKey: sandboxKeys.days(id, resourceId ?? -1),
        queryFn: () => sandboxService.getAvailableDays(id, resourceId as number),
        enabled: !!id && !!resourceId,
    })
}

export function useCreateSandbox() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (req: CreateSandboxRequest) => sandboxService.create(req),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: sandboxKeys.all })
        },
    })
}

export function useUpdateSandboxPicks(id: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (req: UpdateSandboxPicksRequest) => sandboxService.updatePicks(id, req),
        onSuccess: (updated) => {
            qc.setQueryData(sandboxKeys.detail(id), updated)
        },
    })
}

export function useSimulateSandbox(id: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => sandboxService.simulate(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: sandboxKeys.detail(id) })
        },
    })
}

export function useSaveSandbox(id: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => sandboxService.save(id),
        onSuccess: (updated) => {
            qc.setQueryData(sandboxKeys.detail(id), updated)
            qc.invalidateQueries({ queryKey: sandboxKeys.all })
        },
    })
}

export function useDiscardSandbox() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => sandboxService.discard(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: sandboxKeys.all })
        },
    })
}

export function useApplySandbox(id: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => sandboxService.apply(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: sandboxKeys.detail(id) })
            qc.invalidateQueries({ queryKey: sandboxKeys.all })
            qc.invalidateQueries({ queryKey: ['projects'] })
            qc.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}

