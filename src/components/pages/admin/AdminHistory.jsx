import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs } from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"
const ITEMS_PER_PAGE = 10

export default function AdminHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchHistory = async () => {
    try {
      const snap = await getDocs(collection(db, "bookings"))
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error("Error fetching history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL

  if (loading) return <p className="p-6 text-gray-500">Loading history...</p>
  if (!isAdmin) return <p className="p-6 text-red-600">Not authorized.</p>

  // ✅ Filter by status + search
  const filtered = history.filter(
    (h) =>
      ["rejected", "completed", "cancelled"].includes(h.status) &&
      (
        h.name?.toLowerCase().includes(search.toLowerCase()) ||
        h.email?.toLowerCase().includes(search.toLowerCase()) ||
        h.phone?.toLowerCase().includes(search.toLowerCase())
      )
  )

  // 📑 Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const displayed = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking History</h1>

      {/* 🔎 Search bar */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1) // reset to page 1 on search
          }}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-80"
        />
      </div>

      {/* 📋 History Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Package</th>
              <th className="p-3">Date</th>
              <th className="p-3">Event</th>
              <th className="p-3">Venue</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  No matching history found.
                </td>
              </tr>
            ) : (
              displayed.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="p-3">{h.name}</td>
                  <td className="p-3">{h.email}</td>
                  <td className="p-3">{h.phone}</td>
                  <td className="p-3">{h.packageName}</td>
                  <td className="p-3">{h.date}</td>
                  <td className="p-3">{h.eventType || "-"}</td>
                  <td className="p-3">{h.venue || "-"}</td>
                  <td className="p-3">{h.guests || "-"}</td>
                  <td
                    className={`p-3 font-medium capitalize ${
                      h.status === "completed"
                        ? "text-green-600"
                        : h.status === "cancelled"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {h.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ⬅️➡️ Pagination Controls */}
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
