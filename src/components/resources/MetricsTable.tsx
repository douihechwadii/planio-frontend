import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import { ResourceMetrics } from '@/types/resource'
import { AbsenceCell }    from './AbsenceCell'
import { tokens }         from '@/theme/tokens'
import { Can } from '../layout/Can'
import { useRole } from '@/hooks/useRole'

interface MetricsTableProps { resourceId: number; metrics: ResourceMetrics[]; year: string }

const ROWS: { key: keyof ResourceMetrics; label: string }[] = [
    { key: "workingDays",   label: "WK — Working Days"   },
    { key: "absenceDays",   label: "AD — Absence Days"   },
    { key: "availableDays", label: "AV — Available Days" },
    { key: "assignedDays",  label: "AS — Assigned Days"  },
    { key: "remainingDays", label: "RD — Remaining Days" },
]

export function MetricsTable({ resourceId, metrics, year }: MetricsTableProps) {
    const [editingMonth, setEditingMonth] = useState<string | null>(null)
    const { isAdmin } = useRole()

    if (!metrics.length) return <Typography sx={{ color: "text.secondary", fontSize: 13 }}>No metrics available.</Typography>

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: "max-content" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ minWidth: 200, position:"sticky", left:0, bgcolor: tokens.colors.brand.lightGray }}>
                            Metric
                        </TableCell>
                        {metrics.map(m => (
                            <TableCell key={m.month} align="center" sx={{ minWidth: 72, fontVariantNumeric:"tabular-nums" }}>
                                {new Date(`${m.month}-01`).toLocaleDateString('en-US', {
                                    month: 'short',
                                })}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ROWS.map(({ key, label }) => (
                        <TableRow key={key}>
                            <TableCell sx={{
                                position: "sticky",
                                left: 0,
                                bgcolor: "background.paper",
                                borderRight: "1px solid",
                                borderColor: "divider",
                                fontSize: 12,
                                fontWeight: 600,
                            }}>
                                {label}
                            </TableCell>
                            {metrics.map(m => {
                                const isAD  = key === "absenceDays"
                                const isRD  = key === "remainingDays"
                                const val   = m[key] as number
                                return (
                                    <TableCell key={m.month} align="center"
                                               onClick={isAD && isAdmin ? () => setEditingMonth(m.month) : undefined}
                                               sx={{
                                                   cursor: isAD && isAdmin ? "pointer" : "default",
                                                   fontFamily: "DM Mono, monospace",
                                                   '&:hover': isAD ? { bgcolor: tokens.colors.brand.lightPink } : {},
                                                   color: isRD && val < 0  ? tokens.colors.semantic.danger
                                                       : isRD && val === 0 ? tokens.colors.semantic.warning
                                                           : isAD ? tokens.colors.brand.red : "text.primary",
                                                   fontWeight: isRD && val < 0 ? 700 : isAD ? 500 : 400,
                                                   textDecoration: isAD ? "underline dotted" : "none",
                                               }}
                                    >
                                        {isAD && editingMonth === m.month ? (
                                            <Can roles={['ADMIN']}>
                                                <AbsenceCell resourceId={resourceId} month={m.month}
                                                         currentDays={val} year={year} onDone={() => setEditingMonth(null)} />
                                            </Can>
                                        ) : val}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Can roles={['ADMIN']}>
                <Typography variant="caption" sx={{ display:"block", px:2, py:1, color:"text.disabled" }}>
                    Click any AD cell to enter absence days for that month.
                </Typography>
            </Can>
        </TableContainer>
    )
}