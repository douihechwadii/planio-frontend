import { Paper, Typography } from '@mui/material'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { MonthlyCapacity } from '@/types/dashboard'
import { tokens } from '@/theme/tokens'

const shortMonth = (ym: string) => new Date(ym + "-01").toLocaleString("default", { month: "short" })

// CustomTooltip is identical to the original guide — copy it here.

export function GapLineChart({ data }: { data: MonthlyCapacity[] }) {
    const chartData = data.map(d => ({ month: shortMonth(d.month), gap: d.gap }))
    return (
        <Paper sx={{ borderRadius: 1, p: 2.5 }}>
            <Typography variant="h3" sx={{ mb: 2, fontSize: 14 }}>Capacity GAP Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={tokens.colors.brand.red} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={tokens.colors.brand.red} stopOpacity={0}    />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <ReferenceLine y={0} stroke={tokens.colors.semantic.danger} strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="gap" name="GAP"
                          stroke={tokens.colors.brand.red} strokeWidth={2} fill="url(#gapGradient)"
                          dot={(props: any) => {
                              const { cx, cy, payload } = props
                              return <circle key={payload.month} cx={cx} cy={cy} r={4}
                                             fill={payload.gap < 0 ? tokens.colors.semantic.danger : tokens.colors.semantic.success}
                                             stroke="white" strokeWidth={2} />
                          }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    )
}