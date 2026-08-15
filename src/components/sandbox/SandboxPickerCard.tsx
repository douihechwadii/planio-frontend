import { useState } from 'react'
import {
  Card, CardContent, Typography, Box, Button, MenuItem, TextField,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useResources } from '@/hooks/useResources' // adjust to your actual hook
import { useAvailableMonths, useAvailableDays } from '@/hooks/useSandbox'
import { SandboxPickRequest } from '@/types/sandbox'

interface Props {
  sandboxId: number
  projectId: number
  picks: SandboxPickRequest[]
  onChange: (picks: SandboxPickRequest[]) => void
  disabled?: boolean
}

export function SandboxPickerCard({ sandboxId, picks, onChange, disabled }: Props) {
  const { data: resources } = useResources()
  const { data: availableMonths = [] } = useAvailableMonths(sandboxId)

  const resourceIds = [...new Set(picks.map((p) => p.resourceId))]
  const [addingResourceId, setAddingResourceId] = useState<number | ''>('')

  const resourceOptions = resources?.filter((r) => !resourceIds.includes(r.id)) ?? []

  const addResource = () => {
    if (!addingResourceId || availableMonths.length === 0) return
    onChange([...picks, { resourceId: addingResourceId, month: availableMonths[0], workingDays: 0 }])
    setAddingResourceId('')
  }

  const removeResource = (resourceId: number) => {
    onChange(picks.filter((p) => p.resourceId !== resourceId))
  }

  const addMonthRow = (resourceId: number) => {
    const usedMonths = picks.filter((p) => p.resourceId === resourceId).map((p) => p.month)
    const nextMonth = availableMonths.find((m) => !usedMonths.includes(m))
    if (!nextMonth) return
    onChange([...picks, { resourceId, month: nextMonth, workingDays: 0 }])
  }

  const removeRow = (resourceId: number, month: string) => {
    onChange(picks.filter((p) => !(p.resourceId === resourceId && p.month === month)))
  }

  const updateDays = (resourceId: number, month: string, workingDays: number) => {
    onChange(picks.map((p) =>
      p.resourceId === resourceId && p.month === month ? { ...p, workingDays } : p
    ))
  }

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6">Resources</Typography>

        {resourceIds.map((resourceId) => (
          <ResourceRowGroup
            key={resourceId}
            sandboxId={sandboxId}
            resourceId={resourceId}
            resourceName={resources?.find((r) => r.id === resourceId)?.fullName ?? '—'}
            picks={picks.filter((p) => p.resourceId === resourceId)}
            availableMonths={availableMonths}
            onAddMonth={() => addMonthRow(resourceId)}
            onRemoveRow={(month) => removeRow(resourceId, month)}
            onUpdateDays={(month, days) => updateDays(resourceId, month, days)}
            onRemoveResource={() => removeResource(resourceId)}
            disabled={disabled}
          />
        ))}

        {!disabled && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Add resource"
              value={addingResourceId}
              onChange={(e) => setAddingResourceId(Number(e.target.value))}
              sx={{ minWidth: 240 }}
              size="small"
            >
              {resourceOptions.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.fullName}</MenuItem>
              ))}
            </TextField>
            <Button onClick={addResource} disabled={!addingResourceId}>+ Add</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// ── Per-resource month/day table ─────────────────────────────────────

interface RowGroupProps {
  sandboxId: number
  resourceId: number
  resourceName: string
  picks: SandboxPickRequest[]
  availableMonths: string[]
  onAddMonth: () => void
  onRemoveRow: (month: string) => void
  onUpdateDays: (month: string, days: number) => void
  onRemoveResource: () => void
  disabled?: boolean
}

function ResourceRowGroup({
  sandboxId, resourceId, resourceName, picks, availableMonths,
  onAddMonth, onRemoveRow, onUpdateDays, onRemoveResource, disabled,
}: RowGroupProps) {
  const { data: availableDays = {} } = useAvailableDays(sandboxId, resourceId)

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>{resourceName}</Typography>
        {!disabled && (
          <IconButton size="small" onClick={onRemoveResource}><DeleteIcon fontSize="small" /></IconButton>
        )}
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Month</TableCell>
            <TableCell>Working Days</TableCell>
            <TableCell>Available</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {picks.map((p) => (
            <TableRow key={p.month}>
              <TableCell>{p.month}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={p.workingDays}
                  onChange={(e) => onUpdateDays(p.month, Number(e.target.value))}
                  disabled={disabled}
                  slotProps={{ htmlInput: { min: 0, max: availableDays[p.month] ?? undefined } }}
                  sx={{ width: 90 }}
                />
              </TableCell>
              <TableCell>{availableDays[p.month] ?? '—'}</TableCell>
              <TableCell>
                {!disabled && (
                  <IconButton size="small" onClick={() => onRemoveRow(p.month)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!disabled && picks.length < availableMonths.length && (
        <Button size="small" onClick={onAddMonth} sx={{ mt: 1 }}>+ Add month</Button>
      )}
    </Box>
  )
}