import { useState } from 'react'
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, TextField, Typography, CircularProgress } from '@mui/material'
import { useDashboard, useWorkload, useAlerts } from '@/hooks/useDashboard'
import { useProjects } from '@/hooks/useProjects'
import { PageHeader }        from '@/components/layout/PageHeader'
import { KpiGrid }           from '@/components/dashboard/KpiGrid'
import { FteBarChart }       from '@/components/dashboard/FteBarChart'
import { GapLineChart }      from '@/components/dashboard/GapLineChart'
import { AlertBanners }      from '@/components/dashboard/AlertBanners'
import { WorkloadTable }     from '@/components/dashboard/WorkloadTable'
import { FteForecastEditor } from '@/components/dashboard/FteForecastEditor'

export default function DashboardPage() {
    const currentYear  = String(new Date().getFullYear())
    const currentMonth = new Date().toISOString().slice(0, 7)
    const [year,          setYear]         = useState(currentYear)
    const [workloadMonth, setWorkloadMonth] = useState(currentMonth)
    const [projectId,     setProjectId]     = useState<number | ''>('')  // '' = All Projects

    const { data: projects }               = useProjects()
    const { data: dashboard, isLoading: ldash  } = useDashboard(year, projectId || undefined)
    const { data: workload,  isLoading: lwork  } = useWorkload(workloadMonth, projectId || undefined)
    const { data: alerts,   isLoading: lalerts } = useAlerts(year)

    return (
        <Box sx={{ display:"flex", flexDirection:"column", gap:1 }}>
            <PageHeader title="Capacity Dashboard" subtitle="FTE planning overview"
                        action={
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Project</InputLabel>
                                    <Select
                                        value={projectId}
                                        label="Project"
                                        onChange={e => setProjectId(e.target.value as number | '')}
                                    >
                                        <MenuItem value="">All Projects</MenuItem>
                                        {projects?.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Year</InputLabel>
                                    <Select value={year} label="Year" onChange={e => setYear(e.target.value)}>
                                        {[currentYear, String(+currentYear-1), String(+currentYear+1)].map(y => (
                                            <MenuItem key={y} value={y}>{y}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        }
            />

            {/* {!lalerts && alerts && alerts.length > 0 && <AlertBanners alerts={alerts} />} */}

            {ldash ? <Box sx={{ display:"flex", justifyContent:"center", mt:4 }}><CircularProgress /></Box> : (
                <>
                    <KpiGrid data={dashboard ?? []} />
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: projectId ? 12 : 6 }}>
                            <FteBarChart data={dashboard ?? []} />
                        </Grid>
                        {/* GAP compares project-scoped days-planned against the org-wide FTE
                            forecast, so it stops being meaningful once a single project is
                            selected — hide it (and the forecast editor below) rather than
                            show a number that looks precise but isn't comparing like to like. */}
                        {!projectId && (
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <GapLineChart data={dashboard ?? []} />
                            </Grid>
                        )}
                    </Grid>
                    {!projectId && <FteForecastEditor data={dashboard ?? []} year={year} />}
                </>
            )}

            <Box>
                <Box sx={{ display:"flex", alignItems:"center", gap:2, mb:1.5 }}>
                    <Typography variant="h3">Resource Workload</Typography>
                    <TextField type="month" value={workloadMonth}
                               onChange={e => setWorkloadMonth(e.target.value)}
                               size="small" slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }} />
                </Box>
                {lwork ? <CircularProgress size={24} /> : <WorkloadTable data={workload ?? []} />}
            </Box>
        </Box>
    )
}