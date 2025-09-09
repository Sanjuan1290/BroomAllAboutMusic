import { Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase"

// This wrapper protects routes (like Admin pages)
export default function PrivateRoute({ children, adminOnly = false }) {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <p className="text-center py-20">Loading...</p>
  }

  if (!user) {
    // not logged in → go to login
    return <Navigate to="/login" replace />
  }

  // If it's an admin-only route, check email
  if (adminOnly && user.email !== "robertrenbysanjuan@gmail.com") {
    return <Navigate to="/" replace />
  }

  // else, allow access
  return children
}
