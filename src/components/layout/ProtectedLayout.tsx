import { useEffect }    from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth }      from '@/store/authStore'
import { Sidebar }      from './Sidebar'

export function ProtectedLayout() {
    const { isLoggedIn, isInitialised } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // Only redirect once the token check is complete.
        // Without this guard, the component renders before useEffect in
        // AuthProvider finishes, sees isLoggedIn=false, and redirects
        // to /login even if a valid token is present.
        if (isInitialised && !isLoggedIn) {
            navigate('/login', { replace: true })
        }
    }, [isInitialised, isLoggedIn, navigate])

    // Blank slate while the token is being validated — prevents any
    // dashboard queries from firing with no token attached.
    if (!isInitialised) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!isLoggedIn) return null

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden",
            bgcolor: "background.default" }}>
            <Sidebar />
            <Box component="main" sx={{ flex: 1, overflow: "auto", p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    )
}