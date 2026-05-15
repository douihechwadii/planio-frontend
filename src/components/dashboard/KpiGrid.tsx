import { Grid } from '@mui/material'
import { MonthlyCapacity } from '@/types/dashboard'
import { KpiCard } from './KpiCard'

export function KpiGrid({ data }: { data: MonthlyCapacity[] }) {
    if (!data.length) return null
    const totalDtp       = data.reduce((s, m) => s + m.daysToplan,  0)
    const avgFteNeeded   = data.reduce((s, m) => s + m.fteNeeded,   0) / data.length
    const avgFteAssigned = data.reduce((s, m) => s + m.fteAssigned, 0) / data.length
    const alertCount     = data.filter(m => m.hasAlert).length
    return (
        <Grid container spacing={2}>
            <Grid size={{xs:6, sm:3 }}><KpiCard label="Total Days to Plan" value={totalDtp.toLocaleString()} subtitle="Across all active projects" colour="red" /></Grid>
            <Grid size={{xs:6, sm:3 }}><KpiCard label="Avg FTE Needed" value={avgFteNeeded.toFixed(2)} subtitle="Average per month" colour="red" /></Grid>
            <Grid size={{xs:6, sm:3 }}><KpiCard label="Avg FTE Assigned" value={avgFteAssigned.toFixed(2)} subtitle="Average per month" colour="green" /></Grid>
            <Grid size={{xs:6, sm:3 }}><KpiCard label="Alert Months" value={alertCount} subtitle="Months with negative GAP"
                                              colour={alertCount > 0 ? "danger" : "green"} /></Grid>
        </Grid>
    )
}