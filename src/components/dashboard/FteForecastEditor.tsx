import { useState, useRef, useEffect } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, Box } from '@mui/material'
import { MonthlyCapacity }   from '@/types/dashboard'
import { useSetFteForecast } from '@/hooks/useDashboard'
import { Can } from '../layout/Can'
import { useRole } from '@/hooks/useRole'

function ForecastCell({ month, current, year }: { month: string; current: number; year: string }) {
    const [editing, setEditing] = useState(false)
    const [value,   setValue]   = useState(String(current))
    const inputRef              = useRef<HTMLInputElement>(null)
    const setFte                = useSetFteForecast(year)
    const { isAdmin, isManager }           = useRole()
    const canEdit = isAdmin || isManager

    useEffect(() => { setValue(String(current)) }, [current])
    useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

    const save = async () => {
        const fte = parseFloat(value)
        if (!isNaN(fte) && fte !== current) {
            try { await setFte.mutateAsync({ month, fteForecast: fte }) } catch { /* empty */ }
        }
        setEditing(false)
    }

    if (editing) {
        return (
            <TextField inputRef={inputRef} type="number" value={value} size="small"
                       onChange={e => setValue(e.target.value)}
                       onBlur={save}
                       onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false) }}
                       slotProps={{
                           htmlInput: {
                               min: 0,
                               step: 0.5,
                           },
                       }}
                       sx={{ width: 80, "& input": { textAlign:"center", py:0.5 } }} />
        )
    }

    return (
        <Typography onClick={canEdit ? () => setEditing(true) : undefined }
                    sx={{ cursor: canEdit ? "pointer" : ":default", color: canEdit ? "primary.main" : "text.primary", textDecoration:isAdmin ? "underline dotted" : "none",
                        fontFamily:"monospace", fontSize:13 }}>
            {current.toFixed(1)}
        </Typography>
    )
}

const shortMonth = (ym: string) => new Date(ym + "-01").toLocaleString("default", { month: "short" })

export function FteForecastEditor({ data, year }: { data: MonthlyCapacity[]; year: string }) {
    return (
        <Paper sx={{ borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ px:2.5, py:1.5, borderBottom:"1px solid", borderColor:"divider" }}>
                <Typography variant="h3" sx={{ fontSize:14 }}>FTE Forecast (Headcount)</Typography>
                <Can roles={['ADMIN', 'MANAGER']}>
                    <Typography variant="caption" color="text.disabled">Click any value to edit the planned headcount for that month.</Typography>
                </Can>
            </Box>
            <TableContainer sx={{ overflowX:"auto" }}>
                <Table size="small" sx={{ minWidth:"max-content" }}>
                    <TableHead><TableRow>
                        {data.map(d => <TableCell key={d.month} align="center">{shortMonth(d.month)}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody><TableRow>
                        {data.map(d => (
                            <TableCell key={d.month} align="center" sx={{ py: 1.5 }}>
                                <ForecastCell month={d.month} current={d.fteForecast} year={year} />
                            </TableCell>
                        ))}
                    </TableRow></TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}