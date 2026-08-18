import {
  Card, CardContent, Typography, Box, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, TableContainer, Paper,
} from '@mui/material'
import { SimulationResult } from '@/types/sandbox'

interface Props {
  result: SimulationResult
  resourceNames: Record<number, string>
}

// Backend warning strings look like "ResourceName / 2026-08: message" —
// parsed here rather than changing the format on the backend, since other
// consumers (if any) may still expect the flat string.
function parseWarning(raw: string): { resource: string; month: string; message: string } {
  const slashIdx = raw.indexOf(' / ')
  if (slashIdx === -1) return { resource: '—', month: '—', message: raw }

  const resource = raw.slice(0, slashIdx)
  const remainder = raw.slice(slashIdx + 3)
  const colonIdx = remainder.indexOf(': ')
  if (colonIdx === -1) return { resource, month: '—', message: remainder }

  return {
    resource,
    month: remainder.slice(0, colonIdx),
    message: remainder.slice(colonIdx + 2),
  }
}

function CapacityChip({ daysPlanned, daysAssigned }: { daysPlanned: number; daysAssigned: number }) {
  if (daysAssigned === 0) {
    return <Chip label="Under Capacity" color="warning" size="small" variant="outlined" />
  }
  if (daysAssigned > daysPlanned) {
    return <Chip label="Over capacity" color="error" size="small" />
  }
  return <Chip label="OK" color="success" size="small" variant="outlined" />
}

export function SandboxResultsPanel({ result, resourceNames }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {result.warnings.length > 0 && (
        <Card sx={{ borderRadius: 1, borderLeft: '4px solid', borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Warnings</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Warning</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.warnings.map((w, i) => {
                    const { resource, month, message } = parseWarning(w)
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ fontWeight: 600 }}>{resource}</TableCell>
                        <TableCell>{month}</TableCell>
                        <TableCell sx={{ color: 'warning.dark' }}>{message}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Project Capacity</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Planned</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.projectMonthly.map((m) => (
                <TableRow key={m.month}>
                  <TableCell>{m.month}</TableCell>
                  <TableCell>{m.daysPlanned}</TableCell>
                  <TableCell>{m.daysAssigned}</TableCell>
                  <TableCell>
                    <CapacityChip daysPlanned={m.daysPlanned} daysAssigned={m.daysAssigned} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Resource Metrics</Typography>
          {Object.entries(result.byResource).map(([resourceId, metrics]) => (
            <Box key={resourceId} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                {resourceNames[Number(resourceId)] ?? `Resource #${resourceId}`}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>WK</TableCell>
                    <TableCell>AD</TableCell>
                    <TableCell>AV</TableCell>
                    <TableCell>AS</TableCell>
                    <TableCell>RD</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((m) => (
                    <TableRow key={m.month}>
                      <TableCell>{m.month}</TableCell>
                      <TableCell>{m.workingDays}</TableCell>
                      <TableCell>{m.absenceDays}</TableCell>
                      <TableCell>{m.availableDays}</TableCell>
                      <TableCell>{m.assignedDays}</TableCell>
                      <TableCell sx={{ color: m.remainingDays < 0 ? 'error.main' : undefined, fontWeight: m.remainingDays < 0 ? 600 : undefined }}>
                        {m.remainingDays}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}