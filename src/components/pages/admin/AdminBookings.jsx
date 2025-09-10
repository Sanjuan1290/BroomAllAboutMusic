import { useState, useEffect } from "react"
import {
  ClipboardList,
  Trash,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "../../../firebase"

function AdminBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch bookings from Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"))
        setBookings(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        )
      } catch (err) {
        console.error("Error fetching bookings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Update booking status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    } catch (err) {
      console.error("Error updating booking:", err)
    }
  }

  // Delete booking
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    try {
      await deleteDoc(doc(db, "bookings", id))
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error("Error deleting booking:", err)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600">Loading bookings...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList /> Manage Bookings
          </h1>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Package</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{b.name || "N/A"}</td>
                <td className="p-3 border-b">{b.email || "N/A"}</td>
                <td className="p-3 border-b">{b.date}</td>
                <td className="p-3 border-b">{b.package}</td>
                <td className="p-3 border-b">
                  {b.status === "pending" && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                  {b.status === "confirmed" && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      Confirmed
                    </span>
                  )}
                  {b.status === "cancelled" && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  )}
                </td>
                <td className="p-3 border-b flex gap-2">
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(b.id, "confirmed")}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                      >
                        <CheckCircle size={14} /> Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, "cancelled")}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    <Trash size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBookings
