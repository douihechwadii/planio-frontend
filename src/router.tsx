import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedLayout }   from '@/components/layout/ProtectedLayout'
import { AdminCheckGuard }   from '@/components/layout/AdminCheckGuard'
import  LoginPage            from '@/pages/LoginPage'
import  RegisterPage         from '@/pages/RegisterPage'
import  DashboardPage        from '@/pages/DashboardPage'
import  ProjectsPage         from '@/pages/ProjectsPage'
import  ProjectDetailPage    from '@/pages/ProjectDetailPage'
import  ResourcesPage        from '@/pages/ResourcesPage'
import  ResourceDetailPage   from '@/pages/ResourceDetailPage'
import  AssignmentsPage      from '@/pages/AssignmentsPage'
import  UsersPage            from '@/pages/UsersPage'
import { RequireRole } from './components/layout/RequireRole'

export const router = createBrowserRouter([
  {
    // AdminCheckGuard wraps everything so the has-admin check
    // runs once regardless of which URL the user lands on
    element: <AdminCheckGuard />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          { index: true,                  element: <Navigate to='/dashboard' replace /> },
          { path: 'dashboard',            element: <DashboardPage /> },
          { path: 'projects',             element: <ProjectsPage /> },
          { path: 'projects/:id',         element: <ProjectDetailPage /> },
          { path: 'resources',            element: <ResourcesPage /> },
          { path: 'resources/:id',        element: <ResourceDetailPage /> },
          { path: 'assignments',          element: <AssignmentsPage /> },
          
          {
            element: <RequireRole allowed={['ADMIN']} />,
            children: [
              { path: '/admin/users', element: <UsersPage /> },
            ]
          }
        ]
      }
    ]
  }
])