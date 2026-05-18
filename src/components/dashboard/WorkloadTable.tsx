import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, LinearProgress, Typography, Box } from '@mui/material'
import { ResourceWorkload } from '@/types/dashboard'
import { tokens } from '@/theme/tokens'

export function WorkloadTable({ data }: { data: ResourceWorkload[] }) {
    if (!data.length) return <Typography sx={{ color: "text.secondary", fontSize: 13 }}>No workload data.</Typography>
    const sorted = [...data].sort((a, b) => b.utilisationPct - a.utilisationPct)

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
            <Table size="small">
                <TableHead><TableRow>
                    {["Resource","Role","WK","AD","AV","AS","RD","Utilisation"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow></TableHead>
                <TableBody>
                    {sorted.map(r => (
                        <TableRow key={r.resourceId} hover>
                            <TableCell sx={{ fontWeight:600, color:"primary.main" }}>{r.fullName}</TableCell>
                            <TableCell sx={{ fontSize:12, color:"text.secondary" }}>{r.role}</TableCell>
                            <TableCell align="center">{r.workingDays}</TableCell>
                            <TableCell align="center">{r.absenceDays}</TableCell>
                            <TableCell align="center">{r.availableDays}</TableCell>
                            <TableCell align="center" sx={{ fontWeight:600 }}>{r.assignedDays}</TableCell>
                            <TableCell align="center" sx={{
                                fontWeight:600,
                                color: r.remainingDays < 0  ? tokens.colors.semantic.danger
                                    : r.remainingDays <= 3 ? tokens.colors.semantic.warning
                                        :                        tokens.colors.semantic.success
                            }}>{r.remainingDays}</TableCell>
                            <TableCell sx={{ minWidth: 160 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LinearProgress
            variant="determinate"
            // Keep the bar capped at 100% because MUI LinearProgress only supports 0–100.
            value={Math.min(r.utilisationPct, 100)}
            sx={{
                flex: 1,
                height: 6,
                borderRadius: 1,
                "& .MuiLinearProgress-bar": {
                    bgcolor:
                        r.utilisationPct >= 100
                            ? tokens.colors.semantic.danger
                            : r.utilisationPct >= 75
                                ? tokens.colors.semantic.warning
                                : tokens.colors.semantic.success,
                },
            }}
        />

        <Typography
            sx={{
                fontSize: 12,
                fontWeight: 600,
                minWidth: 48,
                color:
                    r.utilisationPct >= 100
                        ? tokens.colors.semantic.danger
                        : r.utilisationPct >= 75
                            ? tokens.colors.semantic.warning
                            : "text.secondary",
            }}
        >
            {r.utilisationPct.toFixed(0)}%
        </Typography>
    </Box>
</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}