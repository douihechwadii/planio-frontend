import { useState, useRef, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
         Paper, Box, TextField, Typography } from '@mui/material'
import { MonthlyPlan} from '@/types/project'
import { tokens } from '@/theme/tokens'
import { Can } from '@/components/layout/Can'
import { useRole } from '@/hooks/useRole'
import { useUpdateMonthlyPlans } from '@/hooks/useProjects'

function PlanCell({ projectId, month, current }: {
    projectId:  number
    month:      string
    current:    number
}) {
    const [editing, setEditing] = useState(false)
    const [value,   setValue]   = useState(String(current))
    const inputRef              = useRef<HTMLInputElement>(null)
    const { isAdmin , isManager}           = useRole()
    const mutation              = useUpdateMonthlyPlans(projectId)
    const canEdit = isAdmin || isManager  

    useEffect(() => { setValue(String(current)) }, [current])
    useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

    const save = async () => {
        const days = parseInt(value, 10)
        if (!isNaN(days) && days !== current && days >= 0) {
            try { await mutation.mutateAsync([{ month, daysPlanned: days }]) } catch { /* empty */ }
        }
        setEditing(false)
    }

    if (editing) {
        return (
            <TextField
                inputRef={inputRef}
                type="number"
                value={value}
                size="small"
                onChange={e => setValue(e.target.value)}
                onBlur={save}
                onKeyDown={e => {
                    if (e.key === "Enter")  save()
                    if (e.key === "Escape") setEditing(false)
                }}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                sx={{ width: 72, "& input": { textAlign: "center", py: 0.5 } }}
            />
        )
    }

    return (
        <Typography
            onClick={canEdit ? () => setEditing(true) : undefined}
            sx={{
                cursor:         canEdit ? "pointer"          : "default",
                color:          canEdit ? "primary.main"     : "text.primary",
                textDecoration: canEdit ? "underline dotted" : "none",
                fontFamily:     "DM Mono, monospace",
                fontSize:       13,
            }}
        >
            {current}
        </Typography>
    )
}

export function MonthlyPlanGrid({ projectId, plans }: { projectId: number; plans: MonthlyPlan[] }) {
    if (!plans.length) return <Box sx={{ color: "text.secondary", fontSize: 13 }}>No monthly plan data.</Box>

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: "max-content" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ minWidth: 160, position: "sticky", left: 0, bgcolor: tokens.colors.brand.lightGray }}>
                            Month
                        </TableCell>
                        {plans.map(p => (
                            <TableCell key={p.month} align="center" sx={{ minWidth: 80 }}>
                                {new Date(`${p.month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ position: "sticky", left: 0, bgcolor: "background.paper", fontWeight: 600 }}>
                            DP — Days Planned
                        </TableCell>
                        {plans.map(p => (
                            <TableCell key={p.month} align="center">
                                <PlanCell
                                    projectId={projectId}
                                    month={p.month}
                                    current={p.daysPlanned}
                                />
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow>
                        <TableCell sx={{ position: "sticky", left: 0, bgcolor: "background.paper", fontWeight: 600 }}>
                            DA — Days Assigned
                        </TableCell>
                        {plans.map(p => (
                            <TableCell key={p.month} align="center"
                                sx={{
                                    fontWeight: p.daysAssigned > 0 ? 400 : 400,
                                    fontFamily: "DM Mono",
                                    fontSize:   13,
                                }}>
                                {p.daysAssigned}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>

            <Can roles={['ADMIN', 'MANAGER']}>
                <Typography variant="caption" sx={{ display: "block", px: 2, py: 1, color: "text.disabled" }}>
                    Click any DP cell to edit the planned days for that month.
                </Typography>
            </Can>
        </TableContainer>
    )
}