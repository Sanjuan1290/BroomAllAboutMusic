import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"

export default function AdminUpcoming() {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.filter((u) => u.status === "accepted").length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          upcoming
            .filter((u) => u.status === "accepted")
            .map((e) => (
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
    </div>
  )
}
