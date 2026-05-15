import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PageHeaderProps { title: string; subtitle?: string; action?: ReactNode }

export function PageHeader({ title, subtitle, action } : PageHeaderProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
            <Box>
                <Typography variant="h1" sx={{ fontSize: 26, fontWeight: 700 }}>{title}</Typography>
                {subtitle && <Typography variant="body2" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
            </Box>
            {action && <Box>{action}</Box>}
        </Box>
    )
}