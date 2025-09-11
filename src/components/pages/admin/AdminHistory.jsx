import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs } from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"

export default function AdminHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

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

  const filtered = history.filter((h) =>
    ["rejected", "completed", "cancelled"].includes(h.status)
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking History</h1>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  No history yet.
                </td>
              </tr>
            ) : (
              filtered.map((h) => (
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
    </div>
  )
}
