import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

import { useClient } from '@/hooks/useClients'
import { useProjects } from '@/hooks/useProjects'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'
import { ClientForm } from '@/components/clients/ClientForm'
import { Can } from '@/components/layout/Can'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const clientId = Number(id)

  const [showEdit, setShowEdit] = useState(false)

  const { data: client, isLoading: clientLoading } = useClient(clientId)
  // No dedicated "projects for this client" endpoint yet — filter the full
  // list client-side. Swap for a scoped query if the project list ever gets
  // large enough for this to matter.
  const { data: allProjects, isLoading: projectsLoading } = useProjects()
  const clientProjects = allProjects?.filter((p) => p.client?.id === clientId) ?? []

  if (clientLoading || projectsLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!client) {
    return <Typography color="error">Client not found.</Typography>
  }

  const stats = [
    {
      label: 'Status',
      value: (
        <Chip
          label={client.status}
          size="small"
          color={client.status === 'ACTIVE' ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      label: 'Client Code',
      value: client.code,
    },
    {
      label: 'Industry',
      value: client.industry ?? '—',
    },
    {
      label: 'Active Projects',
      value: client.totalActiveProjects,
    },
    {
      label: 'Allocated Resources',
      value: client.totalAllocatedResources,
    },
    {
      label: 'Account Manager',
      value: client.accountManagerName
        ? `${client.accountManagerName}${client.accountManagerEmail ? ` (${client.accountManagerEmail})` : ''}`
        : '—',
    },
    {
      label: 'Start Date',
      value: client.startDate ?? '—',
    },
    {
      label: 'End Date',
      value: client.endDate ?? '—',
    },
    {
      label: 'Contract',
      value: client.contract ?? '—',
    },
    {
      label: 'Product',
      value: client.product ?? '—',
    },
    {
      label: 'Countries',
      value: client.countries.length > 0
        ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {client.countries.map((country) => (
              <Chip key={country} label={country} size="small" />
            ))}
          </Box>
        )
        : '—',
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={client.name}
        subtitle={client.industry ?? undefined}
        action={
          <Can roles={['ADMIN', 'MANAGER']}>
            <Button variant="outlined" onClick={() => setShowEdit(true)}>
              Edit Client
            </Button>
          </Can>
        }
      />

      {/* Summary cards */}
      <Grid container spacing={2}>
        {stats.map(({ label, value }) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
            <Card sx={{ borderRadius: 1, height: '100%' }}>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {label}
                </Typography>

                <Box sx={{ fontWeight: 600, fontSize: 14 }}>
                  {value}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Projects for this client */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Projects
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Project', 'Kickoff', 'Go-Live', 'Status'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clientProjects.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/projects/${p.id}`}
                      sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' } }}
                    >
                      {p.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{p.kickoffDate}</TableCell>
                  <TableCell>{p.goLiveDate}</TableCell>
                  <TableCell><StatusChip status={p.status} /></TableCell>
                </TableRow>
              ))}
              {clientProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No projects for this client yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit dialog */}
      <Dialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
            },
          },
        }}
      >
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ClientForm
            clientId={client.id}
            onSuccess={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}