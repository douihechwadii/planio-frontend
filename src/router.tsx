import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import  LoginPage        from '@/pages/LoginPage'
import  DashboardPage    from '@/pages/DashboardPage'
import  ProjectsPage     from '@/pages/ProjectsPage'
import  ProjectDetailPage  from '@/pages/ProjectDetailPage'
import  ResourcesPage    from '@/pages/ResourcesPage'
import  ResourceDetailPage  from '@/pages/ResourceDetailPage'
import  AssignmentsPage  from '@/pages/AssignmentsPage'
import UsersPage from '@/pages/UsersPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: 'dashboard',           element: <DashboardPage /> },
      { path: 'projects',            element: <ProjectsPage /> },
      { path: 'projects/:id',        element: <ProjectDetailPage /> },
      { path: 'resources',           element: <ResourcesPage /> },
      { path: 'resources/:id',       element: <ResourceDetailPage /> },
      { path: 'assignments',         element: <AssignmentsPage /> },
      { path: '/admin/users',         element: <UsersPage /> },
    ]
  }
])