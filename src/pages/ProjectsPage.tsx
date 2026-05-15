import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    CircularProgress } from '@mui/material'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
import { PageHeader }  from '@/components/layout/PageHeader'
import { Project }     from '@/types/project'
import { StatusChip } from '@/components/ui/StatusChip'
import { ProjectForm } from '@/components/projects/ProjectForm'

export default function ProjectsPage() {
    
    const { data: projects, isLoading } = useProjects()
    const deleteProject = useDeleteProject()
    const [showForm, setShowForm] = useState(false)
    const [editing,  setEditing]  = useState<Project | null>(null)

    if (isLoading) return <Box sx={{ display:"flex", justifyContent:"center", mt:8 }}><CircularProgress /></Box>

    return (
        <Box>
            <PageHeader title="Projects" subtitle={`${projects?.length ?? 0} projects`}
                action={<Button variant="contained" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Project</Button>}/>
            
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {["Project","Client","Kickoff","Go-Live","Status",""].map(h => (
                                <TableCell key={h}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects?.map(p => (
                            <TableRow key={p.id} hover>
                                <TableCell>
                                    <Typography component={Link} to={`/projects/${p.id}`}
                                                sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none",
                                                    "&:hover": { textDecoration: "underline" } }}>
                                        {p.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{p.client}</TableCell>
                                <TableCell>{p.kickoffDate}</TableCell>
                                <TableCell>{p.goLiveDate}</TableCell>
                                <TableCell><StatusChip status={p.status} /></TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => { setEditing(p); setShowForm(true) }}>Edit</Button>
                                    <Button size="small" color="error"
                                            onClick={() => { if (confirm('Delete this project?')) deleteProject.mutate(p.id) }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 1,
                            },
                        },
                    }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit Project" : "New Project"}</DialogTitle>
                <DialogContent>
                    <ProjectForm project={editing ?? undefined} onSuccess={() => setShowForm(false)} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}