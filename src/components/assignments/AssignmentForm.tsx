import { useState } from 'react'
import { Box, Button, Select, MenuItem, InputLabel, FormControl, TextField, Alert } from '@mui/material'
import { useProjects }        from '@/hooks/useProjects'
import { useActiveResources } from '@/hooks/useResources'
import { useAssign }          from '@/hooks/useAssignments'
import { getProjectMonths } from '@/utils/date'

interface AssignmentFormProps {
  defaultProjectId?:  number
  defaultResourceId?: number
  onSuccess: () => void
}

interface FormState {
  projectId:    number | ''
  resourceId:   number | ''
  month:        string
  daysAssigned: number | ''
}

export function AssignmentForm({ defaultProjectId, defaultResourceId, onSuccess }: AssignmentFormProps) {
  const { data: projects  } = useProjects()
  const { data: resources } = useActiveResources()
  const assign = useAssign()

  const [form, setForm] = useState<FormState>({
    projectId:    defaultProjectId  ?? '',  // '' not 0 — fixes MUI warning
    resourceId:   defaultResourceId ?? '',  // '' not 0 — fixes MUI warning
    month:        '',
    daysAssigned: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.projectId || !form.resourceId || !form.month || !form.daysAssigned) {
      setError('Please fill in all fields.')
      return
    }

    try {
      await assign.mutateAsync({
        projectId:    Number(form.projectId),
        resourceId:   Number(form.resourceId),
        month:        form.month,
        daysAssigned: Number(form.daysAssigned),
      })
      onSuccess()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Assignment failed')
    }
  }

  const selectedProject = projects?.find(
    p => p.id === form.projectId
  )

  const assignableMonths = selectedProject
  ? getProjectMonths(selectedProject.kickoffDate, selectedProject.goLiveDate)
  : []

  return (
    <Box component='form' onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

      <FormControl fullWidth>
        <InputLabel>Project</InputLabel>
        <Select value={form.projectId} label='Project'
          onChange={e => setForm(p => ({ ...p, projectId: e.target.value as number }))}>
          {projects?.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name} — {p.client}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Resource</InputLabel>
        <Select value={form.resourceId} label='Resource'
          onChange={e => setForm(p => ({ ...p, resourceId: e.target.value as number }))}>
          {resources?.map(r => (
            <MenuItem key={r.id} value={r.id}>{r.fullName} — {r.role}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Month</InputLabel>

        <Select
          value={form.month}
          label="Month"
          onChange={e =>
            setForm(p => ({ ...p, month: e.target.value }))
          }
        >
          {assignableMonths.map(m => (
            <MenuItem key={m} value={m}>
              {new Date(m + '-01').toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </MenuItem>
          ))}
        </Select>
    </FormControl>

      <TextField label='Days Assigned' type='number'
        value={form.daysAssigned}
        onChange={e => setForm(p => ({ ...p, daysAssigned: Number(e.target.value) }))}
        slotProps={{ htmlInput: { min: 1 } }}
        placeholder='e.g. 10' required fullWidth />

      {error && <Alert severity='error'>{error}</Alert>}

      <Button type='submit' variant='contained' disabled={assign.isPending}>
        Assign Resource
      </Button>
    </Box>
  )
}