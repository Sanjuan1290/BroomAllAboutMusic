import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com";
const MAX_SESSION = 2 * 60 * 60 * 1000; // 2 hours in ms

export default function PrivateRoute({ children, adminOnly = true }) {
  const [user, loading] = useAuthState(auth);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const loginTime = localStorage.getItem("adminLoginTime");

    if (loginTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        const remaining = MAX_SESSION - elapsed;

        if (remaining <= 0) {
          // session expired → logout
          auth.signOut();
          localStorage.removeItem("adminLoginTime");
          setTimeLeft(null);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {timeLeft !== null && (
        <div className="fixed top-4 right-4 bg-yellow-200 text-gray-800 px-4 py-2 rounded-lg shadow-md">
          Session expires in:{" "}
          <span className="font-bold">
            {Math.floor(timeLeft / 60000)}m{" "}
            {Math.floor((timeLeft % 60000) / 1000)}s
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
