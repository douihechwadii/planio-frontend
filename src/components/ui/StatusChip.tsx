import { Chip } from '@mui/material'
import { ProjectStatus } from '@/types/project'
import { ResourceStatus } from '@/types/resource'
import { tokens } from '@/theme/tokens'

type Status = ProjectStatus | ResourceStatus

const statusConfig: Record<string, { bg: string; color: string }> = {
    PLANNED:   { bg: tokens.colors.semantic.infoLight,    color: tokens.colors.semantic.info },
    ACTIVE:    { bg: tokens.colors.semantic.successLight, color: tokens.colors.semantic.success },
    CLOSED: { bg: tokens.colors.brand.lightGray,       color: tokens.colors.brand.darkGray },
    INACTIVE:  { bg: tokens.colors.brand.lightGray,       color: tokens.colors.brand.darkGray },
    ON_LEAVE:  { bg: tokens.colors.semantic.warningLight, color: tokens.colors.semantic.warning },
}

export function StatusChip({ status }: { status: Status }) {
    const cfg = statusConfig[status] ?? { bg: "#eee", color: "#666" }
    return (
        <Chip label={status.replace("_", " ")} size="small"
              sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 500, fontSize: 11 }} />
    )
}