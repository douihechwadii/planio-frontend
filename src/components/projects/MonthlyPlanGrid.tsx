import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box} from '@mui/material'
import { MonthlyPlan } from '@/types/project'
import { tokens } from '@/theme/tokens'

export function MonthlyPlanGrid({ plans }: { plans: MonthlyPlan[] }) {
    if (!plans.length) return <Box sx={{color:"text.secondary",fontSize:13}}>No monthly plan data.</Box>

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: "max-content" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ minWidth: 160, position: "sticky", left: 0, bgcolor: tokens.colors.brand.lightGray }}>Month</TableCell>
                        {plans.map(p => <TableCell key={p.month} align="center" sx={{ minWidth: 80 }}>{new Date(`${p.month}-01`).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                        })}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ position:"sticky", left:0, bgcolor:"background.paper", fontWeight:600 }}>
                            DP — Days Planned
                        </TableCell>
                        {plans.map(p => (
                            <TableCell key={p.month} align="center"
                                       sx={{ bgcolor: !p.assignable ? tokens.colors.brand.lightGray : undefined,
                                           color: !p.assignable ? "text.disabled" : "text.primary" }}>
                                {p.daysPlanned}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ position:"sticky", left:0, bgcolor:"background.paper", fontWeight:600 }}>
                            DA — Days Assigned
                        </TableCell>
                        {plans.map(p => (
                            <TableCell key={p.month} align="center"
                                       sx={{ bgcolor: !p.assignable ? tokens.colors.brand.lightGray : undefined,
                                           color: !p.assignable ? "text.disabled"
                                               : p.daysAssigned > 0 ? tokens.colors.brand.red : "text.secondary",
                                           fontWeight: p.daysAssigned > 0 ? 600 : 400 }}>
                                {!p.assignable ? "not assignable" : p.daysAssigned}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}