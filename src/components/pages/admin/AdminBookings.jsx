import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"
const ITEMS_PER_PAGE = 10

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error("Error fetching bookings:", err)
      alert("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    } catch (err) {
      console.error("Error updating booking:", err)
      alert("Failed to update booking status")
    }
  }

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL

  if (loading) return <p className="p-6 text-gray-500">Loading bookings...</p>
  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">
          You must log in as admin to view bookings.
        </p>
      </div>
    )
  }

  // 🔎 Filter pending bookings + search
  const pending = bookings.filter(
    (b) =>
      b.status === "pending" &&
      (
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.email?.toLowerCase().includes(search.toLowerCase()) ||
        b.phone?.toLowerCase().includes(search.toLowerCase())
      )
  )

  // 📑 Pagination
  const totalPages = Math.ceil(pending.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const displayed = pending.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Bookings</h1>

      {/* 🔎 Search bar */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-80"
        />
      </div>

      {/* 📋 Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
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
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-500">
                  No pending bookings.
                </td>
              </tr>
            ) : (
              displayed.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{b.packageName}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">{b.eventType || "-"}</td>
                  <td className="p-3">{b.venue || "-"}</td>
                  <td className="p-3">{b.guests || "-"}</td>
                  <td className="p-3 capitalize">{b.status}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(b.id, "accepted")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="md:hidden space-y-4">
        {displayed.length === 0 ? (
          <p className="text-center text-gray-500">No pending bookings.</p>
        ) : (
          displayed.map((b) => (
            <div
              key={b.id}
              className="bg-white shadow rounded-lg p-4 space-y-2"
            >
              <h2 className="font-bold text-lg">{b.name}</h2>
              <p className="text-sm text-gray-600">{b.email}</p>
              <p className="text-sm">{b.phone}</p>
              <p><span className="font-medium">Package:</span> {b.packageName}</p>
              <p><span className="font-medium">Date:</span> {b.date}</p>
              <p><span className="font-medium">Event:</span> {b.eventType || "-"}</p>
              <p><span className="font-medium">Venue:</span> {b.venue || "-"}</p>
              <p><span className="font-medium">Guests:</span> {b.guests || "-"}</p>
              <p><span className="font-medium">Status:</span> {b.status}</p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateStatus(b.id, "accepted")}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(b.id, "rejected")}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
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
