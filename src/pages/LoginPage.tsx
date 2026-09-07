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
            const authTokens = await authService.login({email, password, deviceId})
            login(authTokens)
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
            background: `linear-gradient(160deg, ${tokens.colors.brand.lightGray} 0%, #eef1f6 100%)`,
            p: 2,
        }}>
            <Card sx={{
                width: "100%",
                maxWidth: 420,
                borderRadius: 1,
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.04)",
            }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 1 }}>
                        <Box component="img" src={logo} alt='PLANIO Logo' sx={{ height: 100, width: "auto" }}/>
                    </Box>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ fontWeight: 600, mb: 0.5, color: tokens.colors.brand.lightGray ? undefined : undefined }}
                    >
                        Welcome back
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Sign in to continue to your workspace
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                        />

                        {error && <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{
                                borderRadius: 1,
                                py: 1.3,
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: "1rem",
                                boxShadow: "none",
                                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                            }}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}