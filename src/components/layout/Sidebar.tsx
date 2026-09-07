import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Popover } from '@mui/material'
import { GridView, Folder, People, Person, AddBox, AssignmentAdd, ExitToApp, AccountCircle, AssignmentInd } from '@mui/icons-material'
import { useLocation, Link } from 'react-router-dom'
import { tokens } from '@/theme/tokens'
import logo from '@/assets/logo.svg'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from '@/store/authStore'
import { AlertBanners } from '@/components/dashboard/AlertBanners'
import { Alert as AlertType } from '@/types/dashboard'
import { dashboardService } from '@/services/dashboardService'

export function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const navItems = [
    { href: '/dashboard',   label: 'Dashboard',   Icon: GridView  },
    { href: '/projects',    label: 'Projects',    Icon: Folder    },
    { href: '/clients',     label: 'Clients',     Icon: AssignmentInd },
    { href: '/resources',   label: 'Resources',   Icon: People    },
    { href: '/assignments', label: 'Assignments', Icon: AssignmentAdd },
    ...(role === 'ADMIN' || role === 'MANAGER'
      ? [{ href: '/sandbox', label: 'Simulations', Icon: AddBox }]
      : []),
    ...(role === 'ADMIN'
      ? [{ href: '/admin/users', label: 'Users', Icon: Person }]
      : []),
  ]

  useEffect(() => {
  const from = new Date()
  const to = new Date()
  to.setMonth(to.getMonth() + 3)

  const fmt = (d: Date) => d.toISOString().slice(0, 7) // "YYYY-MM"

  dashboardService.getAlerts(fmt(from), fmt(to))
    .then(setAlerts)
    .catch(console.error)
}, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login", { replace: true });
    }
  }

  const open = Boolean(anchorEl)

  return (
    <Drawer variant="permanent" sx={{
      width: 240,
      "& .MuiDrawer-paper": {
        width: 240,
        bgcolor: tokens.colors.brand.midnight,
        color: "white",
        border: "none",
      }
    }}>
      <Box sx={{ px: 0, py: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box component="img" src={logo} alt='PLANIO Logo' sx={{ height: 100, width: "auto", filter: "brightness(0) invert(1)" }} />
      </Box>

      <List sx={{ px: 1, py: 1.5 }}>
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <ListItemButton key={href} component={Link} to={href}
              sx={{
                borderRadius: 1, mb: 0.5,
                bgcolor: isActive ? "rgba(200,16,46,0.9)" : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
                '&:hover': {
                  bgcolor: isActive ? "rgba(200,16,46,0.9)" : "rgba(255,255,255,0.08)",
                  color: "white"
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? tokens.colors.brand.white : tokens.colors.brand.lightGray } } }} />
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{
        mt: "auto",
        px: 2,
        py: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "rgba(255,255,255,0.8)",
      }}>
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "inherit", position: "relative" }}>
          <AccountCircle fontSize='medium' />
          {alerts.length > 0 && (
            <Box sx={{
              position: "absolute", top: 2, right: 2, width: 8, height: 8,
              borderRadius: "50%", bgcolor: "#ff4d4f",
            }} />
          )}
        </IconButton>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 1.5, width: 340, maxHeight: 400, overflowY: "auto" }}>
            <AlertBanners alerts={alerts} />
            {!alerts.length && (
              <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", py: 2 }}>
                No alerts
              </Typography>
            )}
          </Box>
        </Popover>

        <Typography sx={{
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.75)",
          mx: 1,
          flex: 1,
          textAlign: "center",
        }}>
          {role ?? "admin"}
        </Typography>

        <IconButton onClick={handleLogout} size='small' sx={{
          color: "rgba(255,255,255,0.8)",
          "&:hover": {
            color: "#ff4d4f",
            bgcolor: "rgba(255,77,79,0.1)",
          },
        }}>
          <ExitToApp fontSize='small' />
        </IconButton>
      </Box>
    </Drawer>
  )
}