import { useState, useEffect } from 'react'
import { Box, Button, TextField, MenuItem, Autocomplete } from '@mui/material'
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { ClientRequest, ClientStatus } from '@/types/client'

const COUNTRY_OPTIONS = [
  'Tunisia', 'France', 'Germany', 'United States', 'United Kingdom',
  'Canada', 'Morocco', 'Algeria', 'Spain', 'Italy',
  // extend or replace with a full ISO country list as needed
]

interface Props {
  clientId?: number
  onSuccess: () => void
}

const emptyForm: ClientRequest = {
  name: '', code: '', industry: '', status: 'ACTIVE',
  accountManagerName: '', accountManagerEmail: '',
  startDate: '', endDate: '', contract: '', product: '',
  countries: [],
}

export function ClientForm({ clientId, onSuccess }: Props) {
  const { data: existing } = useClient(clientId ?? -1)
  const createClient = useCreateClient()
  const updateClient = useUpdateClient(clientId ?? -1)

  const [form, setForm] = useState<ClientRequest>(emptyForm)

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name, code: existing.code, industry: existing.industry ?? '',
        status: existing.status, accountManagerName: existing.accountManagerName ?? '',
        accountManagerEmail: existing.accountManagerEmail ?? '', startDate: existing.startDate ?? '',
        endDate: existing.endDate ?? '', contract: existing.contract ?? '',
        product: existing.product ?? '', countries: existing.countries,
      })
    }
  }, [existing?.id])

  const set = <K extends keyof ClientRequest>(key: K, value: ClientRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    const mutation = clientId ? updateClient : createClient
    mutation.mutate(form, { onSuccess })
  }

  const isPending = createClient.isPending || updateClient.isPending

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <TextField label="Client Name" value={form.name} onChange={(e) => set('name', e.target.value)} fullWidth />
      <TextField label="Client Code" value={form.code} onChange={(e) => set('code', e.target.value)} fullWidth />
      <TextField label="Industry" value={form.industry ?? ''} onChange={(e) => set('industry', e.target.value)} fullWidth />

      <TextField
        select label="Status" value={form.status}
        onChange={(e) => set('status', e.target.value as ClientStatus)}
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
      >
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="INACTIVE">Inactive</MenuItem>
      </TextField>

      <TextField
        label="Account Manager Name" value={form.accountManagerName ?? ''}
        onChange={(e) => set('accountManagerName', e.target.value)} fullWidth
      />
      <TextField
        label="Account Manager Email" value={form.accountManagerEmail ?? ''}
        onChange={(e) => set('accountManagerEmail', e.target.value)} fullWidth
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Start Date" type="date" value={form.startDate ?? ''}
          onChange={(e) => set('startDate', e.target.value)} fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End Date" type="date" value={form.endDate ?? ''}
          onChange={(e) => set('endDate', e.target.value)} fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <TextField label="Contract" value={form.contract ?? ''} onChange={(e) => set('contract', e.target.value)} fullWidth />
      <TextField label="Product" value={form.product ?? ''} onChange={(e) => set('product', e.target.value)} fullWidth />

      <Autocomplete
        multiple
        options={COUNTRY_OPTIONS}
        value={form.countries}
        onChange={(_, value) => set('countries', value)}
        renderInput={(params) => <TextField {...params} label="Countries" />}
      />

      <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Saving…' : clientId ? 'Save Changes' : 'Create Client'}
      </Button>
    </Box>
  )
}