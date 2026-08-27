import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import AppRoutes from '@/routes'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; msg: string }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false, msg: '' } }
  static getDerivedStateFromError(e: Error) { return { hasError: true, msg: e.message } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-content-center p-6 text-center">
          <h2 className="font-display text-2xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-slate dark:text-slatedark mt-2">{this.state.msg || 'Unexpected error'}</p>
          <button onClick={()=>location.reload()} className="btn-primary mt-4">Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          <ToastContainer position="top-right" autoClose={2500} theme="light" />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
