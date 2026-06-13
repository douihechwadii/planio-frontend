import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { authService } from "@/services/authService";
import { tokens } from "@/theme/tokens";
import { Typography, Box, Card, CardContent, TextField, Button, Alert } from "@mui/material";
import logo from '@/assets/logo.svg'

export default function RegisterPage() {
    const [email,    setEmail]    = useState("")
    const [password, setPassword] = useState("")
    const [confirm,  setConfirm]  = useState("")
    const [error,    setError]    = useState("")
    const [loading,  setLoading]  = useState(false)
    const { login } = useAuth()
    const navigate  = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirm) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const tokens = await authService.register({ email, password })
            login(tokens)                     // store the tokens + update role in context
            navigate('/dashboard', { replace: true })
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: tokens.colors.brand.lightGray
        }}>
            <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 1 }}>
                <CardContent sx={{ p: 1 }}>
                    <Box sx={{ px: 0, py: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box component="img" src={logo} alt='PLANIO Logo' sx={{ height: 150, width: "auto" }} />
                    </Box>

                    <Typography variant="h6" sx={{ textAlign: "center", mb: 2, color: tokens.colors.brand.midnight }}>
                        Create Admin Account
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            fullWidth
                        />

                        {error && <Alert severity="error">{error}</Alert>}

                        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}