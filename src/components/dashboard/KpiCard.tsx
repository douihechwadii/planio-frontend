import { Card, CardContent, Typography } from '@mui/material'
import { tokens } from '@/theme/tokens'

type Colour = 'red' | 'green' | 'danger' | 'amber'

interface KpiCardProps { label: string; value: string | number; subtitle?: string; colour?: Colour }

const colourMap: Record<Colour, string> = {
    red:    tokens.colors.brand.red,
    green:  tokens.colors.semantic.success,
    danger: tokens.colors.semantic.danger,
    amber:  tokens.colors.semantic.warning,
}

export function KpiCard({ label, value, subtitle, colour = 'red' }: KpiCardProps) {
    return (
        <Card sx={{ borderRadius: 1, borderTop: `4px solid ${colourMap[colour]}` }}>
            <CardContent sx={{ py: 2.5 }}>
                <Typography variant="caption" sx={{ textTransform:"uppercase", letterSpacing:"0.05em", color:"text.secondary" }}>
                    {label}
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 30, fontWeight: 700, color: tokens.colors.brand.midnight }}>
                    {value}
                </Typography>
                {subtitle && <Typography variant="caption" color="text.disabled">{subtitle}</Typography>}
            </CardContent>
        </Card>
    )
}