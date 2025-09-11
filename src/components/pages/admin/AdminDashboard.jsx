import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"

export default function AdminDashboard() {
  const [totalPackages, setTotalPackages] = useState(0)
  const [upcomingBookings, setUpcomingBookings] = useState(0)
  const [completedEvents, setCompletedEvents] = useState(0)
  const [statusData, setStatusData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      // Packages
      const pkgSnap = await getDocs(collection(db, "packages"))
      setTotalPackages(pkgSnap.size)

      // Status counts
      const statuses = ["accepted", "completed", "rejected", "cancelled", "pending"]
      const statusCounts = {}

      for (let s of statuses) {
        const snap = await getDocs(query(collection(db, "bookings"), where("status", "==", s)))
        statusCounts[s] = snap.size
      }

      setUpcomingBookings(statusCounts["accepted"] || 0)
      setCompletedEvents(statusCounts["completed"] || 0)

      setStatusData(
        statuses.map((s) => ({
          name: s.charAt(0).toUpperCase() + s.slice(1),
          value: statusCounts[s] || 0,
        }))
      )

      // Monthly
      const allBookings = await getDocs(collection(db, "bookings"))
      const monthlyCounts = {}
      allBookings.forEach((doc) => {
        const data = doc.data()
        if (data.date) {
          const month = new Date(data.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          })
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1
        }
      })
      setMonthlyData(Object.entries(monthlyCounts).map(([month, count]) => ({ month, count })))

      // Recent Activity (latest 5 bookings)
      const recentSnap = await getDocs(
        query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5))
      )
      setRecentBookings(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">
          You must log in as admin to view the dashboard.
        </p>
      </div>
    )
  }

  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>
  }

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-200 text-gray-700",
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-2xl shadow bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
          <h2 className="text-lg font-medium">Total Packages</h2>
          <p className="text-4xl font-bold mt-2">{totalPackages}</p>
        </div>
        <div className="p-6 rounded-2xl shadow bg-gradient-to-r from-green-500 to-emerald-700 text-white">
          <h2 className="text-lg font-medium">Upcoming Bookings</h2>
          <p className="text-4xl font-bold mt-2">{upcomingBookings}</p>
        </div>
        <div className="p-6 rounded-2xl shadow bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <h2 className="text-lg font-medium">Completed Events</h2>
          <p className="text-4xl font-bold mt-2">{completedEvents}</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-500">No recent bookings.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3">{b.packageName}</td>
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          statusColors[b.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
