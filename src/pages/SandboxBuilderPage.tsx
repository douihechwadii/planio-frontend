import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material'
import { useSandbox, useUpdateSandboxPicks, useSimulateSandbox,
         useSaveSandbox, useDiscardSandbox, useApplySandbox } from '@/hooks/useSandbox'
import { PageHeader } from '@/components/layout/PageHeader'
import { SandboxPickerCard } from '@/components/sandbox/SandboxPickerCard'
import { SandboxResultsPanel } from '@/components/sandbox/SandboxResultsPanel'
import { SandboxPickRequest } from '@/types/sandbox'

export default function SandboxBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const sandboxId = Number(id)
  const navigate = useNavigate()

  const { data: sandbox, isLoading } = useSandbox(sandboxId)
  const updatePicks = useUpdateSandboxPicks(sandboxId)
  const simulate = useSimulateSandbox(sandboxId)
  const save = useSaveSandbox(sandboxId)
  const discard = useDiscardSandbox()
  const apply = useApplySandbox(sandboxId)

  // Local, unsaved picks — synced to the sandbox only on "Simulate"
  const [localPicks, setLocalPicks] = useState<SandboxPickRequest[]>([])

  useEffect(() => {
    if (sandbox) setLocalPicks(sandbox.picks.map(({ resourceId, month, workingDays }) => ({ resourceId, month, workingDays })))
  }, [sandbox?.id]) // only re-sync when the sandbox identity changes, not on every refetch

  const handleSimulate = async () => {
    await updatePicks.mutateAsync({ picks: localPicks })
    await simulate.mutateAsync()
  }

  const handleApply = async () => {
    if (!confirm('Apply these changes to real assignments? This cannot be undone.')) return
    await apply.mutateAsync()
    navigate(`/projects/${sandbox?.projectId}`)
  }

  const handleDiscard = async () => {
    if (!confirm('Discard this simulation?')) return
    await discard.mutateAsync(sandboxId)
    navigate('/sandbox')
  }

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  }

  if (!sandbox) {
    return <Typography color="error">Simulation not found.</Typography>
  }

  const isApplied = sandbox.status === 'APPLIED'
  const hasFreshResult = !sandbox.resultDirty && sandbox.lastResult

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={`Simulation — ${sandbox.projectName}`}
        subtitle={isApplied ? 'Applied' : 'Draft — not yet applied'}
      />

      {isApplied && (
        <Alert severity="success">
          This simulation has been applied to real assignments. It's now read-only.
        </Alert>
      )}

      <SandboxPickerCard
        sandboxId={sandboxId}
        projectId={sandbox.projectId}
        picks={localPicks}
        onChange={setLocalPicks}
        disabled={isApplied}
      />

      {!isApplied && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSimulate}
            disabled={localPicks.length === 0 || simulate.isPending || updatePicks.isPending}
          >
            {simulate.isPending || updatePicks.isPending ? 'Simulating…' : 'Simulate'}
          </Button>
          <Button variant="outlined" onClick={() => save.mutate()} disabled={save.isPending}>
            Save for Later
          </Button>
          <Button variant="outlined" color="error" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApply}
            disabled={!hasFreshResult || apply.isPending}
            sx={{ ml: 'auto' }}
          >
            {apply.isPending ? 'Applying…' : 'Apply to Project'}
          </Button>
        </Box>
      )}

      {hasFreshResult && <SandboxResultsPanel result={sandbox.lastResult!} />}

      {sandbox.resultDirty && sandbox.lastResult && (
        <Alert severity="info">Picks changed since the last simulation — run Simulate again to see updated results.</Alert>
      )}
    </Box>
  )
}