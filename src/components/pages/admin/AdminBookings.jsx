// src/components/pages/admin/AdminBookings.jsx
import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const snap = await getDocs(collection(db, "bookings"))
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

  if (loading) {
    return <p className="p-6 text-gray-500">Loading bookings...</p>
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">
          You must log in as admin to view bookings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>

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
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-500">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
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
    </div>
  )
}
