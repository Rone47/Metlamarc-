import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import PortalLogin from './pages/PortalLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ClientPortal from './pages/ClientPortal'
import InvoicePrintPage from './pages/InvoicePrintPage'
import QuotePrintPage from './pages/QuotePrintPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedRoute role="client">
                <ClientPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/invoices/:invoiceId" element={<InvoicePrintPage />} />
          <Route path="/quotes/:quoteId" element={<QuotePrintPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
