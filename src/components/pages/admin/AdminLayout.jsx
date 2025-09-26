import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { LogOut, Menu } from "lucide-react"
import { auth } from "../../../firebase"
import { signOut } from "firebase/auth"
import { useState } from "react"

export default function AdminLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  // ✅ Active link style
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
      isActive ? "bg-gray-700 text-yellow-300 font-bold" : ""
    }`

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white flex items-center justify-between p-4 z-50 shadow">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-gray-800 text-white p-6 space-y-6 transform transition-transform duration-300 z-40
          ${mobileOpen ? "pt-20 translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <h1 className="hidden lg:block text-2xl font-bold">Admin Panel</h1>

        <nav className="space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/packages" className={linkClass}>
            Packages
          </NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>
            Bookings
          </NavLink>
          <NavLink to="/admin/calendar" className={linkClass}>
            Calendar
          </NavLink>
          <NavLink to="/admin/upcoming" className={linkClass}>
            Upcoming
          </NavLink>
          <NavLink to="/admin/history" className={linkClass}>
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

      {/* Overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Content */}
      <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
