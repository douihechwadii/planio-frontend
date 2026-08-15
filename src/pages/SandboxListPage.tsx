import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  CircularProgress, MenuItem, TextField,
} from '@mui/material'
import { useSandboxes, useCreateSandbox } from '@/hooks/useSandbox'
import { useProjects } from '@/hooks/useProjects'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'

export default function SandboxListPage() {
  const { data: sandboxes, isLoading } = useSandboxes()
  const { data: projects } = useProjects()
  const createSandbox = useCreateSandbox()
  const navigate = useNavigate()

  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('')

  const handleCreate = () => {
    if (!selectedProjectId) return
    createSandbox.mutate(
      { projectId: selectedProjectId },
      {
        onSuccess: (sandbox) => {
          setShowNewDialog(false)
          navigate(`/sandbox/${sandbox.id}`)
        },
      }
    )
  }

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      <PageHeader
        title="Simulation Sandbox"
        subtitle={`${sandboxes?.length ?? 0} saved simulations`}
        action={
          <Button variant="contained" onClick={() => setShowNewDialog(true)}>
            + New Simulation
          </Button>
        }
      />

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Project', 'Status', 'Created', ''].map((h) => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sandboxes?.map((s) => (
              <TableRow key={s.id} hover onClick={() => navigate(`/sandbox/${s.id}`)} sx={{ cursor: 'pointer' }}>
                <TableCell sx={{ fontWeight: 600 }}>{s.projectName}</TableCell>
                <TableCell><StatusChip status={s.status} /></TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/sandbox/${s.id}`) }}>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sandboxes?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No simulations yet — start one above.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showNewDialog} onClose={() => setShowNewDialog(false)} maxWidth="xs" fullWidth
              slotProps={{ paper: { sx: { borderRadius: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>New Simulation</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            select
            label="Project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            fullWidth
            sx={{ mt: 1 }}
          >
            {projects?.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            disabled={!selectedProjectId || createSandbox.isPending}
            onClick={handleCreate}
          >
            {createSandbox.isPending ? 'Creating…' : 'Start Building'}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  )
}