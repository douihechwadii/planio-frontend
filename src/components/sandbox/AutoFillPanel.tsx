import { useState } from 'react'
import {
  Card, CardContent, Typography, Box, Button, Checkbox,
  FormControlLabel, FormGroup, RadioGroup, Radio,
  Alert,
} from '@mui/material'
import { useAvailableMonths, useAutoFillSandbox } from '@/hooks/useSandbox'
import { SandboxPickRequest } from '@/types/sandbox'

interface Props {
  sandboxId: number
  onGenerated: (picks: SandboxPickRequest[]) => void
  disabled?: boolean
}

export function AutoFillPanel({ sandboxId, onGenerated, disabled }: Props) {
  const { data: availableMonths = [] } = useAvailableMonths(sandboxId)
  const autoFill = useAutoFillSandbox(sandboxId)

  const [scope, setScope] = useState<'full' | 'select'>('full')
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const handleGenerate = () => {
  const months = scope === 'full' ? null : selectedMonths
  autoFill.mutate(months, {
    onSuccess: (result) => {
      onGenerated(result.sandbox.picks.map(({ resourceId, month, workingDays }) => ({ resourceId, month, workingDays })))
    },
  })
}

  const canGenerate = scope === 'full' || selectedMonths.length > 0

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Auto-Fill Suggested Assignments</Typography>

        <RadioGroup value={scope} onChange={(e) => setScope(e.target.value as 'full' | 'select')}>
          <FormControlLabel value="full" control={<Radio />} label="Full project duration" disabled={disabled} />
          <FormControlLabel value="select" control={<Radio />} label="Specific months" disabled={disabled} />
        </RadioGroup>

        {scope === 'select' && (
          <FormGroup sx={{ pl: 4 }}>
            {availableMonths.map((month) => (
              <FormControlLabel
                key={month}
                control={
                  <Checkbox
                    checked={selectedMonths.includes(month)}
                    onChange={() => toggleMonth(month)}
                    disabled={disabled}
                  />
                }
                label={month}
              />
            ))}
          </FormGroup>
        )}

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={disabled || !canGenerate || autoFill.isPending}
          sx={{ alignSelf: 'flex-start' }}
        >
          {autoFill.isPending ? 'Generating…' : 'Generate Suggested Assignments'}
        </Button>

        {autoFill.data && autoFill.data.warnings.length > 0 && (
        <Alert severity="warning">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {autoFill.data.warnings.map((w, i) => (
            <Typography key={i} variant="body2">{w}</Typography>
            ))}
          </Box>
        </Alert>
)}

        <Typography variant="caption" color="text.secondary">
          This replaces any picks currently in the builder below — review and adjust
          before simulating.
        </Typography>
      </CardContent>
    </Card>
  )
}