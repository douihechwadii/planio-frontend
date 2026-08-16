import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Menu, MenuItem, IconButton, Divider } from '@mui/material'
import { GridView, Folder, People, SwapHoriz, Person, AddBox, AssignmentAdd, PermIdentity, ExitToApp, AccountCircle, AssignmentInd } from '@mui/icons-material'
import { useLocation, Link } from 'react-router-dom'
import { tokens } from '@/theme/tokens'
import logo from '@/assets/logo.svg'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from '@/store/authStore'


export function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role } = useAuth()


  const navItems = [
  { href: '/dashboard',   label: 'Dashboard',   Icon: GridView  },
  { href: '/projects',    label: 'Projects',    Icon: Folder    },
  { href: '/clients', label: 'Clients', Icon: AssignmentInd },
  { href: '/resources',   label: 'Resources',   Icon: People    },
  { href: '/assignments', label: 'Assignments', Icon: AssignmentAdd },
  { href: '/sandbox', label: 'Simulations', Icon: AddBox },

  ...(role == 'ADMIN'
    ? [{ href: '/admin/users', label: 'Users', Icon: Person },]
  : []),
  ]

  const handleLogout = async () => {

    try {
      await authService.logout()
    } catch(error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login", { replace: true });
    }
  }

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
      {/* Logo */}
      <Box sx={{ px: 0, py: 0,display: "flex", justifyContent: "center", alignItems: "center", }}>
        <Box component="img" src={logo} alt='PLANIO Logo' sx={{ height: 100, width: "auto", filter: "brightness(0) invert(1)",}}/>
      </Box>

      {/* Navigation */}
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
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? tokens.colors.brand.white : tokens.colors.brand.lightGray}, }, }} />
            </ListItemButton>
          )
        })}
      </List>

      {/* Footer User Menu */}
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
        <AccountCircle fontSize='medium'/>

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
          <ExitToApp fontSize='small'/>
        </IconButton>

      </Box>
    </Drawer>
  )
}