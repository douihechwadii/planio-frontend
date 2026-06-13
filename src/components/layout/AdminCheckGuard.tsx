// components/AdminCheckGuard.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { authService } from '@/services/authService'

export function AdminCheckGuard() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        authService.hasAdmin().then((exists) => {
            if (!exists && pathname !== '/register') {
                navigate('/register', { replace: true })
            }
            if (exists && pathname === '/register') {
                navigate('/login', { replace: true })
            }
            setChecked(true)
        })
    }, [pathname])

    if (!checked) return null  // or your global spinner

    return <Outlet />
}