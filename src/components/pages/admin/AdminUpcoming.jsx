import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"
const ITEMS_PER_PAGE = 10

export default function AdminUpcoming() {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchUpcoming = async () => {
    try {
      const snap = await getDocs(collection(db, "bookings"))
      setUpcoming(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error("Error fetching upcoming:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcoming()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status })
      setUpcoming((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL

  if (loading) return <p className="p-6 text-gray-500">Loading upcoming...</p>
  if (!isAdmin) return <p className="p-6 text-red-600">Not authorized.</p>

  // ✅ Filter accepted bookings + search
  const filtered = upcoming.filter(
    (u) =>
      u.status === "accepted" &&
      (
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
      )
  )

  // 📑 Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const displayed = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>

      {/* 🔎 Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1) // reset page when searching
          }}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-80"
        />
      </div>

      {/* 📋 Events Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          displayed.map((e) => (
            <div
              key={e.id}
              className="p-5 bg-white rounded-xl shadow space-y-3 border"
            >
              <h2 className="text-lg font-semibold">{e.packageName}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>👤 <span className="font-medium">{e.name}</span></p>
                <p>📧 {e.email}</p>
                <p>📞 {e.phone}</p>
                <p>📅 {e.date}</p>
                <p>🎉 {e.eventType || "N/A"}</p>
                <p>📍 {e.venue || "N/A"}</p>
                <p>👥 {e.guests || "N/A"} guests</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateStatus(e.id, "completed")}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => updateStatus(e.id, "cancelled")}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ⬅️➡️ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
