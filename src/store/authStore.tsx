import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthResponse } from '@/types/auth'

interface AuthContextType {
    accessToken:    string | null
    isLoggedIn:     boolean
    isInitialised:  boolean   // true once the token check is complete
    login:  (tokens: AuthResponse) => void
    logout: () => void
    role: string | null
    uid: number | null
}

const AuthContext = createContext<AuthContextType | null>(null)


function decodeToken(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

// Decode a JWT and return its expiry timestamp (ms), or 0 if invalid.
function getTokenExpiry(token: string): number {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return (payload.exp ?? 0) * 1000
    } catch {
        return 0
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken,   setAccessToken]   = useState<string | null>(null)
    const [isInitialised, setIsInitialised] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [uid, setUid] = useState<number | null>(null)

    // On mount: read the stored token and validate it is not expired.
    // If it is expired or missing, clear storage so the user goes to /login.
    useEffect(() => {
        const stored = localStorage.getItem('accessToken')
        if (stored && getTokenExpiry(stored) > Date.now()) {
            setAccessToken(stored)

            const decoded = decodeToken(stored)
            setRole(decoded?.role ?? null)
            setUid(decoded?.uid ?? null)
        } else {
            // Token missing or expired — clear everything
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setAccessToken(null)
            setRole(null)
            setUid(null)
        }
        setIsInitialised(true)
    }, [])

    const login = (tokens: AuthResponse) => {
        localStorage.setItem('accessToken',  tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        setAccessToken(tokens.accessToken)

        const decoded = decodeToken(tokens.accessToken)
        setRole(decoded?.role ?? null)
        setUid(decoded?.uid ?? null)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
        setRole(null)
        setUid(null)
    }

    return (
        <AuthContext.Provider value={{ accessToken, isLoggedIn: !!accessToken, isInitialised, login, logout, role, uid}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}