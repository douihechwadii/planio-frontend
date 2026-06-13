import { useAuth } from "@/store/authStore";

interface Props {
    roles: string[]
    children: React.ReactNode
}

export function Can({ roles, children }: Props) {
    const { role } = useAuth()

    if (!role || !roles.includes(role)) return null

    return <>{children}</>
}