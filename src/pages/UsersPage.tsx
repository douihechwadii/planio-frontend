import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    CircularProgress } from '@mui/material'
import { PageHeader }  from '@/components/layout/PageHeader'
import { useDeleteUser, useUsers } from '@/hooks/useUsers'
import { User } from '@/types/user'
import { UserForm } from '@/components/users/UserForm'

export default function UsersPage() {
    
    const { data: users, isLoading } = useUsers()
    const deleteUser = useDeleteUser()
    const [showForm, setShowForm] = useState(false)
    const [editing,  setEditing]  = useState<User | null>(null)

    if (isLoading) return <Box sx={{ display:"flex", justifyContent:"center", mt:8 }}><CircularProgress /></Box>

    return (
        <Box>
            <PageHeader title="Users" subtitle={`${users?.length ?? 0} users`}
                action={<Button variant="contained" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add User</Button>}/>
            
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {["Id","Email","Role", ""].map(h => (
                                <TableCell key={h}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map(u => (
                            <TableRow key={u.id} hover>
                                <TableCell>
                                    <Typography
                                                sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none",
                                                    "&:hover": { textDecoration: "underline" } }}>
                                        {u.id}
                                    </Typography>
                                </TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => { setEditing(u); setShowForm(true) }}>Edit</Button>
                                    <Button size="small" color="error"
                                            onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(u.id) }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 1,
                            },
                        },
                    }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Edit User" : "New User"}</DialogTitle>
                <DialogContent>
                <UserForm user={editing ?? undefined} onSuccess={() => setShowForm(false)} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}