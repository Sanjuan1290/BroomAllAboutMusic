import { Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase"

export default function PrivateRoute({ children, adminOnly = true }) {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Checking access...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.email !== "robertrenbysanjuan@gmail.com") {
    return <Navigate to="/" replace />
  }

  return children
}
