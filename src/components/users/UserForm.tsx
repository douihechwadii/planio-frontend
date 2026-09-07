import { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { UpdateUserRequest, User, UserRole } from "@/types/user";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { useAuth } from "@/store/authStore";
import useRefreshToken from "@/hooks/useRefreshToken";
import { replace, useNavigate } from "react-router-dom";

interface UserFormProps { user?: User; onSuccess: () => void }

export function UserForm({ user, onSuccess }: UserFormProps) {
    const isEdit = !!user
    const { uid } = useAuth()
    const refreshToken = useRefreshToken()
    const navigate = useNavigate()
    const [form, setForm] = useState<UpdateUserRequest>({
        email:    user?.email    ?? "",
        password: "",
        role:     user?.role     ?? "",
    })
    const [error, setError] = useState("")
    const createUser = useCreateUser()
    const updateUser = useUpdateUser(user?.id ?? 0)

    const set = (field: keyof UpdateUserRequest) => (e: any) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const isEditingSelf = isEdit && user?.id === uid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("")
        try {
            if (isEdit) {
                // Only send password if the user actually typed one
                const payload: UpdateUserRequest = {
                    ...form,
                    ...(form.password === "" && { password: undefined }),
                }
                await updateUser.mutateAsync(payload)
                if (isEditingSelf) {
                    await refreshToken()
                    navigate("/dashboard", { replace: true })
                }
            } else {
                await createUser.mutateAsync(form)
            }
            onSuccess()
        } catch (err: any) { setError(err?.response?.data?.message ?? "Something went wrong") }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display:"flex", flexDirection:"column", gap:2, pt:1 }}>

            {/* Email: always shown, but read-only when editing */}
            <TextField
                label="Email"
                value={form.email}
                onChange={set("email")}
                required={!isEdit}
                disabled={isEdit}        // can't change email on existing user
                fullWidth
            />

            {/* Password: required on create, optional on edit */}
            <TextField
                label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
                value={form.password}
                onChange={set("password")}
                required={!isEdit}       // mandatory only on create
                type="password"
                fullWidth
            />

            {/* Role: always shown and editable */}
            <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={form.role} label="Role" onChange={set("role")}>
                    {(["ADMIN", "USER", "MANAGER"] as UserRole[]).map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {error && <Box sx={{ color:"error.main", fontSize:13 }}>{error}</Box>}

            <Button
                type="submit"
                variant="contained"
                disabled={createUser.isPending || updateUser.isPending}
            >
                {isEdit ? "Save Changes" : "Create User"}
            </Button>
        </Box>
    )
}