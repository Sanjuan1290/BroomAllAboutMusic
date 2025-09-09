import { Package, Calendar, ClipboardList, LogOut } from "lucide-react"
import { auth } from "../../../firebase"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"

export default function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Packages Card */}
        <div
          onClick={() => navigate("/admin/packages")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
        >
          <Package className="w-10 h-10 text-blue-500" />
          <h2 className="mt-3 text-lg font-semibold">Manage Packages</h2>
        </div>

        {/* Bookings Card */}
        <div
          onClick={() => navigate("/admin/bookings")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
        >
          <ClipboardList className="w-10 h-10 text-green-500" />
          <h2 className="mt-3 text-lg font-semibold">View Bookings</h2>
        </div>

        {/* Calendar Card */}
        <div
          onClick={() => navigate("/admin/calendar")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
        >
          <Calendar className="w-10 h-10 text-purple-500" />
          <h2 className="mt-3 text-lg font-semibold">Event Calendar</h2>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  )
}
