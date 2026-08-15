import {
  Card, CardContent, Typography, Box, Alert, Table, TableBody,
  TableCell, TableHead, TableRow, Chip,
} from '@mui/material'
import { SimulationResult } from '@/types/sandbox'

interface Props {
  result: SimulationResult
}

export function SandboxResultsPanel({ result }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {result.warnings.length > 0 && (
        <Alert severity="warning">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {result.warnings.map((w, i) => <Typography key={i} variant="body2">{w}</Typography>)}
          </Box>
        </Alert>
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
                    {m.daysAssigned > m.daysPlanned
                      ? <Chip label="Over capacity" color="error" size="small" />
                      : <Chip label="OK" color="success" size="small" variant="outlined" />}
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
                      <TableCell>{m.wk}</TableCell>
                      <TableCell>{m.ad}</TableCell>
                      <TableCell>{m.av}</TableCell>
                      <TableCell>{m.as}</TableCell>
                      <TableCell sx={{ color: m.rd < 0 ? 'error.main' : undefined, fontWeight: m.rd < 0 ? 600 : undefined }}>
                        {m.rd}
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