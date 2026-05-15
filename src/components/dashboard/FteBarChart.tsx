import { Paper, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MonthlyCapacity } from '@/types/dashboard'
import { tokens } from '@/theme/tokens'

const shortMonth = (ym: string) => new Date(ym + "-01").toLocaleString("default", { month: "short" })

// CustomTooltip is identical to the original guide — copy it here.

export function FteBarChart({ data }: { data: MonthlyCapacity[] }) {
    const chartData = data.map(d => ({ ...d, month: shortMonth(d.month) }))
    return (
        <Paper sx={{ borderRadius: 1, p: 2.5 }}>
            <Typography variant="h3" sx={{ mb: 2, fontSize: 14 }}>FTE Needed / Assigned / Forecast</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fteNeeded"   name="FTE Needed"   fill={tokens.colors.chart.fteNeeded}   radius={[3,3,0,0]} />
                    <Bar dataKey="fteAssigned" name="FTE Assigned" fill={tokens.colors.chart.fteAssigned} radius={[3,3,0,0]} />
                    <Bar dataKey="fteForecast" name="FTE Forecast" fill={tokens.colors.chart.fteForecast} radius={[3,3,0,0]} />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    )
}