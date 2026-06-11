import axios from 'axios'

// In development, baseURL is empty so requests go to localhost:5173
// and Vite's proxy forwards them to localhost:8080 — avoiding CORS entirely.
// In production, VITE_API_URL points to the deployed backend.
const api = axios.create({
    baseURL: import.meta.env.PROD
        ? (import.meta.env.VITE_API_URL ?? '')
        : '',
    headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// ── Response interceptor — auto-refresh on 401 ───────────────────────
let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject:  (err: unknown)  => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token!))
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config
        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error)
        }
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`
                return api(original)
            })
        }
        original._retry   = true
        isRefreshing      = true
        const refreshToken = localStorage.getItem('refreshToken')
        try {
            const { data } = await axios.post(
                import.meta.env.PROD
                    ? `${import.meta.env.VITE_API_URL ?? ''}/api/auth/refresh-token`
                    : '/api/auth/refresh-token',
                { refreshToken, deviceId: 'web' }
            )
            localStorage.setItem('accessToken',  data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
            processQueue(null, data.accessToken)
            return api(original)
        } catch (err) {
            processQueue(err, null)
            // Refresh failed — clear tokens and redirect to login
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(err)
        } finally {
            isRefreshing = false
        }
    }
)

export default api