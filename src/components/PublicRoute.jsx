import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// This is the OPPOSITE of ProtectedRoute.
// It wraps pages that should only be visible to LOGGED-OUT users (like Login page).
// If a logged-in user tries to visit this page, redirect them away.
function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    // Already logged in - no point showing the login page again, send to products
    return <Navigate to="/products" replace />
  }

  // Not logged in - safe to show the login page
  return children
}

export default PublicRoute
