import { Package, Calendar, ClipboardList, LogOut } from "lucide-react"
import { auth, db } from "../../../firebase"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    bookings: 0,
    packages: 0,
    upcoming: 0,
  })

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsSnap = await getDocs(collection(db, "bookings"))
        const packagesSnap = await getDocs(collection(db, "packages"))

        const today = new Date()
        const upcoming = bookingsSnap.docs.filter((doc) => {
          const data = doc.data()
          return data.date && new Date(data.date) >= today
        }).length

        setStats({
          bookings: bookingsSnap.size,
          packages: packagesSnap.size,
          upcoming,
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-blue-600">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-900">{stats.bookings}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-green-600">Upcoming Events</h3>
          <p className="text-3xl font-bold text-green-900">{stats.upcoming}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-purple-600">Packages</h3>
          <p className="text-3xl font-bold text-purple-900">{stats.packages}</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/packages")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:scale-[1.02] transition"
        >
          <Package className="w-10 h-10 text-blue-500" />
          <h2 className="mt-3 text-lg font-semibold">Manage Packages</h2>
        </div>

        <div
          onClick={() => navigate("/admin/bookings")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:scale-[1.02] transition"
        >
          <ClipboardList className="w-10 h-10 text-green-500" />
          <h2 className="mt-3 text-lg font-semibold">View Bookings</h2>
        </div>

        <div
          onClick={() => navigate("/admin/calendar")}
          className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:scale-[1.02] transition"
        >
          <Calendar className="w-10 h-10 text-purple-500" />
          <h2 className="mt-3 text-lg font-semibold">Event Calendar</h2>
        </div>
      </div>
    </div>
  )
}
