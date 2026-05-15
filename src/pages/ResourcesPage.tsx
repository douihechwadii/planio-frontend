import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material'
import { useResources, useDeleteResource } from '@/hooks/useResources'
import { PageHeader }   from '@/components/layout/PageHeader'
import { StatusChip }   from '@/components/ui/StatusChip'
import { ResourceForm } from '@/components/resources/ResourceForm'
import { Resource } from '@/types/resource'

export default function ResourcesPage() {
    const { data: resources, isLoading } = useResources()
    const deleteResource = useDeleteResource()
    const [showForm, setShowForm] = useState(false)
    const [editing,  setEditing]  = useState<Resource | null>(null)

    if (isLoading) return <Box sx={{ display:"flex",justifyContent:"center",mt:8 }}><CircularProgress /></Box>

    return (
        <Box>
            <PageHeader title="Resources" subtitle={`${resources?.length ?? 0} team members`}
                        action={<Button variant="contained" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Resource</Button>} />
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                    <TableHead><TableRow>
                        {["Name","Role","Email","Status",""].map(h => <TableCell key={h}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>
                        {resources?.map(r => (
                            <TableRow key={r.id} hover>
                                <TableCell>
                                    <Typography component={Link} to={`/resources/${r.id}`}
                                                sx={{ color:"primary.main", fontWeight:600, textDecoration:"none", "&:hover":{ textDecoration:"underline" } }}>
                                        {r.fullName}
                                    </Typography>
                                </TableCell>
                                <TableCell>{r.role}</TableCell>
                                <TableCell sx={{ color:"text.secondary" }}>{r.email}</TableCell>
                                <TableCell><StatusChip status={r.status} /></TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => { setEditing(r); setShowForm(true) }}>Edit</Button>
                                    <Button size="small" color="error"
                                            onClick={() => { if (confirm('Delete this resource?')) deleteResource.mutate(r.id) }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth slotProps={{
                paper: {
                    sx: {
                        borderRadius: 1,
                    },
                },
            }}>
                <DialogTitle>{editing ? "Edit Resource" : "New Resource"}</DialogTitle>
                <DialogContent><ResourceForm resource={editing ?? undefined} onSuccess={() => setShowForm(false)} /></DialogContent>
            </Dialog>
        </Box>
    )
}