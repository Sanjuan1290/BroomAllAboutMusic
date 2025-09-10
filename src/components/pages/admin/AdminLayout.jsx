import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { LogOut, Package, ClipboardList, Calendar, Clock, History } from "lucide-react"
import { auth } from "../../../firebase"
import { signOut } from "firebase/auth"

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <nav className="space-y-3">
          <NavLink to="/admin" end className="block hover:text-yellow-300">
            Dashboard
          </NavLink>
          <NavLink to="/admin/packages" className="block hover:text-yellow-300">
            Packages
          </NavLink>
          <NavLink to="/admin/bookings" className="block hover:text-yellow-300">
            Bookings
          </NavLink>
          <NavLink to="/admin/calendar" className="block hover:text-yellow-300">
            Calendar
          </NavLink>
          <NavLink to="/admin/upcoming" className="block hover:text-yellow-300">
            Upcoming
          </NavLink>
          <NavLink to="/admin/history" className="block hover:text-yellow-300">
            History
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
