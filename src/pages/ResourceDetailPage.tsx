import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Card, CardContent, Typography, Grid, Dialog, DialogTitle,
    DialogContent, CircularProgress, Select, MenuItem } from '@mui/material'
import { useResource, useResourceMetrics } from '@/hooks/useResources'
import { PageHeader }   from '@/components/layout/PageHeader'
import { StatusChip }   from '@/components/ui/StatusChip'
import { ResourceForm } from '@/components/resources/ResourceForm'
import { MetricsTable } from '@/components/resources/MetricsTable'
import { Can } from '@/components/layout/Can'

export default function ResourceDetailPage() {
    const { id } = useParams<{ id: string }>()
    const resourceId = Number(id)
    const currentYear = String(new Date().getFullYear())
    const [year,     setYear]     = useState(currentYear)
    const [showEdit, setShowEdit] = useState(false)
    const { data: resource, isLoading: lr } = useResource(resourceId)
    const { data: metrics,  isLoading: lm } = useResourceMetrics(resourceId, year)

    if (lr) return <Box sx={{ display:"flex",justifyContent:"center",mt:8 }}><CircularProgress /></Box>
    if (!resource) return <Typography color="error">Resource not found.</Typography>

    return (
        <Box sx={{ display:"flex", flexDirection:"column", gap:3 }}>
            <PageHeader title={resource.fullName} subtitle={resource.role}
                        action={<Can roles={['ADMIN', 'MANAGER']}><Button variant="outlined" onClick={() => setShowEdit(true)}>Edit</Button></Can>} />
            <Grid container spacing={2}>
                {[
                    { label:"Email", value: resource.email },
                    { label:"Role",  value: resource.role  },
                    { label:"Status",value: <StatusChip status={resource.status} /> },
                ].map(({ label, value }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
                        <Card sx={{ borderRadius:1 }}>
                            <CardContent sx={{ py:2 }}>
                                <Typography variant="caption" color="text.secondary">{label}</Typography>
                                <Box sx={{ mt:0.5, fontWeight:600, fontSize:14 }}>{value}</Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box>
                <Box sx={{ display:"flex", alignItems:"center", gap:2, mb:1.5 }}>
                    <Typography variant="h3">Capacity Metrics</Typography>
                    <Select value={year} onChange={e => setYear(e.target.value)} size="small">
                        {[currentYear, String(+currentYear-1), String(+currentYear+1)].map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </Box>
                {lm ? <CircularProgress size={24} /> : <MetricsTable resourceId={resourceId} metrics={metrics ?? []} year={year} />}
            </Box>
            <Dialog open={showEdit} onClose={() => setShowEdit(false)} maxWidth="sm" fullWidth slotProps={{
                paper: {
                    sx: {
                        borderRadius: 1,
                    },
                },
            }}>
                <DialogTitle>Edit Resource</DialogTitle>
                <DialogContent><ResourceForm resource={resource} onSuccess={() => setShowEdit(false)} /></DialogContent>
            </Dialog>
        </Box>
    )
}