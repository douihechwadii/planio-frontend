import { useState } from 'react'
import { Alert, AlertTitle, Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { Alert as AlertType } from '@/types/dashboard'

export function AlertBanners({ alerts }: { alerts: AlertType[] }) {
    const [dismissed, setDismissed] = useState<string[]>([])
    const visible = alerts.filter(a => !dismissed.includes(a.month))
    if (!visible.length) return null

    return (
        <Box sx={{ display:"flex", flexDirection:"column", gap:1 }}>
            {visible.map(alert => (
                <Alert key={alert.month}
                       severity={alert.severity === "CRITICAL" ? "error" : "warning"}
                       action={
                           <IconButton size="small" onClick={() => setDismissed(p => [...p, alert.month])}>
                               <Close fontSize="small" />
                           </IconButton>
                       }
                >
                    <AlertTitle>{alert.severity} — {alert.month} — GAP: {alert.gap.toFixed(2)} FTE</AlertTitle>
                    {alert.suggestion}
                </Alert>
            ))}
        </Box>
    )
}