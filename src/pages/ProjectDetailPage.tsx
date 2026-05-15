import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
} from '@mui/material'

import { useProject, useMonthlyPlan } from '@/hooks/useProjects'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { MonthlyPlanGrid } from '@/components/projects/MonthlyPlanGrid'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)

  const [showEdit, setShowEdit] = useState(false)

  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: monthlyPlan = [], isLoading: planLoading } =
    useMonthlyPlan(projectId)

  if (projectLoading || planLoading) {
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

  if (!project) {
    return <Typography color="error">Project not found.</Typography>
  }

  const stats = [
    {
      label: 'Kickoff Date',
      value: project.kickoffDate,
    },
    {
      label: 'Go-Live Date',
      value: project.goLiveDate,
    },
    {
      label: 'Status',
      value: <StatusChip status={project.status} />,
    },
    {
      label: 'Months',
      value: monthlyPlan.length,
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={project.name}
        subtitle={project.client}
        action={
          <Button variant="outlined" onClick={() => setShowEdit(true)}>
            Edit Project
          </Button>
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

      {/* Monthly plan */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly Plan
        </Typography>
        <MonthlyPlanGrid plans={monthlyPlan} />
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
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <ProjectForm
            project={project}
            onSuccess={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}