import { useState } from 'react'
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { Resource, ResourceRequest, ResourceStatus } from '@/types/resource'
import { useCreateResource, useUpdateResource } from '@/hooks/useResources'

interface ResourceFormProps { resource?: Resource; onSuccess: () => void }

export function ResourceForm({ resource, onSuccess }: ResourceFormProps) {
    const isEdit = !!resource
    const [form, setForm] = useState<ResourceRequest>({
        fullName: resource?.fullName ?? "", role: resource?.role ?? "",
        email: resource?.email ?? "", status: resource?.status ?? "ACTIVE",
    })
    const [error, setError] = useState("")
    const createResource = useCreateResource()
    const updateResource = useUpdateResource(resource?.id ?? 0)
    const set = (field: keyof ResourceRequest) => (e: any) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("")
        try {
            if (isEdit) await updateResource.mutateAsync(form)
            else        await createResource.mutateAsync(form)
            onSuccess()
        } catch (err: any) { setError(err?.response?.data?.message ?? "Something went wrong") }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display:"flex", flexDirection:"column", gap:2, pt:1 }}>
            <TextField label="Full Name" value={form.fullName} onChange={set("fullName")} required fullWidth />
            <FormControl>
                <InputLabel>Role</InputLabel>
                <Select value={form.role} label="Role" onChange={set("role")}>
                    <MenuItem value="LeadIC">Lead IC</MenuItem>
                    <MenuItem value="SeniorLeadIC">Senior Lead IC</MenuItem>
                    <MenuItem value="ImplementationConsultant">Implementation Consultant</MenuItem>
                </Select>
            </FormControl>
            <TextField label="Email" type="email" value={form.email} onChange={set("email")} required fullWidth />
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={set("status")}>
                    {(["ACTIVE","INACTIVE","ON_LEAVE"] as ResourceStatus[]).map(s => (
                        <MenuItem key={s} value={s}>{s.replace("_"," ")}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {error && <Box sx={{ color:"error.main", fontSize:13 }}>{error}</Box>}
            <Button type="submit" variant="contained" disabled={createResource.isPending || updateResource.isPending}>
                {isEdit ? "Save Changes" : "Add Resource"}
            </Button>
        </Box>
    )
}