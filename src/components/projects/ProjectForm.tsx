import { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Project, ProjectRequest, ProjectStatus } from "@/types/project";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useClients } from '@/hooks/useClients';

interface ProjectFormProps { project?: Project; onSuccess: () => void }

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
    const isEdit = !!project
    type ProjectFormState = Omit<ProjectRequest, 'clientId'> & { clientId: number | '' }
    const [form, setForm] = useState<ProjectFormState>({
        name: project?.name ?? "", clientId: project?.client.id ?? '',
        kickoffDate: project?.kickoffDate ?? "", goLiveDate: project?.goLiveDate ?? "",
        status: project?.status ?? "PLANNED",
    })
    const [error, setError] = useState("")
    const createProject = useCreateProject()
    const updateProject = useUpdateProject(project?.id ?? 0)
    const { data: clients } = useClients()

    const set = (field: keyof ProjectFormState) => (e: any) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const setValue = <K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) =>
        setForm(prev => ({ ...prev, [field]: value }))


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("")
        if (!form.clientId) { setError("Please select a client"); return }
        try {
            const payload: ProjectRequest = { ...form, clientId: form.clientId as number }
            if (isEdit) { await updateProject.mutateAsync(payload) }
            else        { await createProject.mutateAsync(payload) }
            onSuccess()
        } catch (err: any) { setError(err?.response?.data?.error ?? "Something went wrong") }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display:"flex", flexDirection:"column", gap:2, pt:1 }}>
            <TextField label="Project Name" value={form.name} onChange={set("name")} required fullWidth />
            <TextField select label="Client" value={form.clientId ?? ''} onChange={(e) => setValue('clientId', Number(e.target.value))} fullWidth slotProps={{ inputLabel: { shrink: true } }}>
                {clients?.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
            </TextField>
            <TextField label="Kickoff Date" type="date" value={form.kickoffDate}
                       onChange={set("kickoffDate")} slotProps={{ inputLabel: { shrink: true } }} required fullWidth />
            <TextField label="Go-Live Date" type="date" value={form.goLiveDate}
                       onChange={set("goLiveDate")} slotProps={{ inputLabel: { shrink: true } }} required fullWidth />
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={set("status")}>
                    {(["PLANNED","ACTIVE","COMPLETED","CANCELLED"] as ProjectStatus[]).map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {error && <Box sx={{ color:"error.main", fontSize:13 }}>{error}</Box>}
            <Button type="submit" variant="contained" disabled={createProject.isPending || updateProject.isPending}>
                {isEdit ? "Save Changes" : "Create Project"}
            </Button>
        </Box>
    )
}