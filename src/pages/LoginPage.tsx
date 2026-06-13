import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { authService } from "@/services/authService";
import { tokens } from "@/theme/tokens";
import { Typography, Box, Card, CardContent, TextField, Button, Alert } from "@mui/material";
import logo from '@/assets/logo.svg'

export default function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error,    setError]    = useState("")
    const [loading,  setLoading]  = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const deviceId = 'web';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(""); setLoading(true)
        try {
            const tokens = await authService.login({email, password, deviceId})
            login(tokens)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Invalid email or password")
        } finally { setLoading(false) }
    }

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: tokens.colors.brand.lightGray
        }}>
            <Card sx={{
                width: "100%",
                maxWidth: 420,
                borderRadius: 1
            }}>
                <CardContent sx={{ p: 1}}>
                    {/* Logo */}
                    <Box sx={{ px: 0, py: 0,display: "flex", justifyContent: "center", alignItems: "center", }}>
                        <Box component="img" src={logo} alt='PLANIO Logo' sx={{ height: 150, width: "auto",}}/>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth/>
                        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth/>
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}