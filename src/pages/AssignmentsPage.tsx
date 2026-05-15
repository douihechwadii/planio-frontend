import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, Select, MenuItem,
    FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress } from '@mui/material'
import { useProjects }  from '@/hooks/useProjects'
import { useResources } from '@/hooks/useResources'
import { useAssignments, useAssignmentsByProject, useAssignmentsByResource, useDeleteAssignment } from '@/hooks/useAssignments'
import { PageHeader }     from '@/components/layout/PageHeader'
import { AssignmentForm } from '@/components/assignments/AssignmentForm'

type FilterMode = 'project' | 'resource'

export default function AssignmentsPage() {
    const [showForm,   setShowForm]   = useState(false)
    const [filterMode, setFilterMode] = useState<FilterMode>('project')
    const [selectedId, setSelectedId] = useState(0)
    const { data: projects  } = useProjects()
    const { data: resources } = useResources()
    const deleteAssignment    = useDeleteAssignment()

    const { data: allAssignments, isLoading: lAll } = useAssignments()
    const { data: byProject,  isLoading: lpj } = useAssignmentsByProject(filterMode === 'project'  && selectedId !== 0 ? selectedId : undefined)
    const { data: byResource, isLoading: lrs } = useAssignmentsByResource(filterMode === 'resource' && selectedId !== 0 ? selectedId : undefined)

    const assignments = selectedId === 0 ? allAssignments : filterMode === 'project' ? byProject : byResource
    const isLoading   = selectedId === 0 ? lAll : filterMode === 'project' ? lpj : lrs

    return (
        <Box>
            <PageHeader title="Assignments" subtitle="Assign resources to projects by month"
                        action={<Button variant="contained" onClick={() => setShowForm(true)}>+ New Assignment</Button>} />
            <Box sx={{ display:"flex", gap:2, mb:2 }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by</InputLabel>
                    <Select value={filterMode} label='Filter by'
                            onChange={e => { setFilterMode(e.target.value as FilterMode); setSelectedId(0) }}>
                        <MenuItem value='project'>Project</MenuItem>
                        <MenuItem value='resource'>Resource</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex:1 }}>
                    <InputLabel>{filterMode === "project" ? "All projects" : "All resources"}</InputLabel>
                    <Select value={selectedId} label={filterMode === "project" ? "All projects" : "All resources"}
                            onChange={e => setSelectedId(Number(e.target.value))}>
                        <MenuItem value={0}>All</MenuItem>
                        {(filterMode === "project" ? projects : resources)?.map(item => (
                            <MenuItem key={item.id} value={item.id}>
                                {"fullName" in item ? item.fullName : item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {isLoading ? <CircularProgress /> : (
                <TableContainer component={Paper} sx={{ borderRadius:1 }}>
                    <Table size="small">
                        <TableHead><TableRow>
                            {["Project","Resource","Role","Month","Days",""].map(h => <TableCell key={h}>{h}</TableCell>)}
                        </TableRow></TableHead>
                        <TableBody>
                            {assignments?.map(a => (
                                <TableRow key={a.id} hover>
                                    <TableCell sx={{ fontWeight:600, color:"primary.main" }}>{a.projectName}</TableCell>
                                    <TableCell>{a.resourceFullName}</TableCell>
                                    <TableCell sx={{ color:"text.secondary"}}>{a.resourceRole}</TableCell>
                                    <TableCell >{a.month}</TableCell>
                                    <TableCell sx={{ fontWeight:600, color:"primary.main" }}>{a.daysAssigned}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" color="error"
                                                onClick={() => { if (confirm('Remove this assignment?')) deleteAssignment.mutate(a.id) }}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth slotProps={{
                paper: { sx: { borderRadius: 1 } },
            }}>
                <DialogTitle>New Assignment</DialogTitle>
                <DialogContent><AssignmentForm onSuccess={() => setShowForm(false)} /></DialogContent>
            </Dialog>
        </Box>
    )
}