import { useAuth } from "@/store/authStore";

export function useRole() {
    const { role } = useAuth()

    return {
        isAdmin: role === 'ADMIN',
        isUser: role === 'USER',
        isManager: role === 'MANAGER',
        can: (roles: string[]) => !!role && roles.includes(role),
    }
}