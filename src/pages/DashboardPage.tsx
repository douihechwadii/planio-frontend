import { useState } from 'react'
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, TextField, Typography, CircularProgress } from '@mui/material'
import { useDashboard, useWorkload, useAlerts } from '@/hooks/useDashboard'
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

    const { data: dashboard, isLoading: ldash  } = useDashboard(year)
    const { data: workload,  isLoading: lwork  } = useWorkload(workloadMonth)
    const { data: alerts,   isLoading: lalerts } = useAlerts(year)

    return (
        <Box sx={{ display:"flex", flexDirection:"column", gap:1 }}>
            <PageHeader title="Capacity Dashboard" subtitle="FTE planning overview"
                        action={
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Year</InputLabel>
                                <Select value={year} label="Year" onChange={e => setYear(e.target.value)}>
                                    {[currentYear, String(+currentYear-1), String(+currentYear+1)].map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
            />

            {/* {!lalerts && alerts && alerts.length > 0 && <AlertBanners alerts={alerts} />} */}

            {ldash ? <Box sx={{ display:"flex", justifyContent:"center", mt:4 }}><CircularProgress /></Box> : (
                <>
                    <KpiGrid data={dashboard ?? []} />
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 6 }}><FteBarChart data={dashboard ?? []} /></Grid>
                        <Grid size={{ xs: 12, lg: 6 }}><GapLineChart data={dashboard ?? []} /></Grid>
                    </Grid>
                    <FteForecastEditor data={dashboard ?? []} year={year} />
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