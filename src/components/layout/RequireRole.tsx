import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/authStore'

interface Props {
    allowed: string[]  // roles that can access this route
}

export function RequireRole({ allowed }: Props) {
    const { role } = useAuth()

    if (!role || !allowed.includes(role)) {
        return <Navigate to='/dashboard' replace />
    }

    return <Outlet />
}