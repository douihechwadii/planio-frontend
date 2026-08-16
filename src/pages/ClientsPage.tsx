import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  CircularProgress, Chip,
} from '@mui/material'
import { useClients, useDeleteClient } from '@/hooks/useClients'
import { PageHeader } from '@/components/layout/PageHeader'
import { Can } from '@/components/layout/Can'
import { ClientForm } from '@/components/clients/ClientForm'
import { ClientSummary } from '@/types/client'

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients()
  const deleteClient = useDeleteClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ClientSummary | null>(null)

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      <PageHeader
        title="Clients"
        subtitle={`${clients?.length ?? 0} clients`}
        action={
          <Can roles={['ADMIN']}>
            <Button variant="contained" onClick={() => { setEditing(null); setShowForm(true) }}>
              + Add Client
            </Button>
          </Can>
        }
      />

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Client', 'Code', 'Industry', 'Status', 'Active Projects', ''].map((h) => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients?.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  <Typography component={Link} to={`/clients/${c.id}`}
                              sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' } }}>
                    {c.name}
                  </Typography>
                </TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.industry ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={c.status}
                    size="small"
                    color={c.status === 'ACTIVE' ? 'success' : 'default'}
                    //variant="outlined"
                  />
                </TableCell>
                <TableCell>{c.totalActiveProjects}</TableCell>
                <TableCell align="right">
                  <Can roles={['ADMIN']}>
                    <Button size="small" onClick={() => { setEditing(c); setShowForm(true) }}>Edit</Button>
                  </Can>
                  <Can roles={['ADMIN']}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => { if (confirm('Delete this client?')) deleteClient.mutate(c.id) }}
                    >
                      Delete
                    </Button>
                  </Can>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth
              slotProps={{ paper: { sx: { borderRadius: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Client' : 'New Client'}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ClientForm clientId={editing?.id} onSuccess={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}