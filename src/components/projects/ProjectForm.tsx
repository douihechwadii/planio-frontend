import { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Project, ProjectRequest, ProjectStatus } from "@/types/project";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";

interface ProjectFormProps { project?: Project; onSuccess: () => void }

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
    const isEdit = !!project
    const [form, setForm] = useState<ProjectRequest>({
        name: project?.name ?? "", client: project?.client ?? "",
        kickoffDate: project?.kickoffDate ?? "", goLiveDate: project?.goLiveDate ?? "",
        status: project?.status ?? "PLANNED",
    })
    const [error, setError] = useState("")
    const createProject = useCreateProject()
    const updateProject = useUpdateProject(project?.id ?? 0)

    const set = (field: keyof ProjectRequest) => (e: any) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("")
        try {
            if (isEdit) { await updateProject.mutateAsync(form) }
            else        { await createProject.mutateAsync(form) }
            onSuccess()
        } catch (err: any) { setError(err?.response?.data?.message ?? "Something went wrong") }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display:"flex", flexDirection:"column", gap:2, pt:1 }}>
            <TextField label="Project Name" value={form.name} onChange={set("name")} required fullWidth />
            <TextField label="Client" value={form.client} onChange={set("client")} required fullWidth />
            <TextField label="Kickoff Date" type="date" value={form.kickoffDate}
                       onChange={set("kickoffDate")} slotProps={{ inputLabel: { shrink: true } }} required fullWidth />
            <TextField label="Go-Live Date" type="date" value={form.goLiveDate}
                       onChange={set("goLiveDate")} slotProps={{ inputLabel: { shrink: true } }} required fullWidth />
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={set("status")}>
                    {(["PLANNED","ACTIVE","CLOSED"] as ProjectStatus[]).map(s => (
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