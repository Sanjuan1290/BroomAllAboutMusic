import { useState, useEffect } from "react"
import { db, auth } from "../../../firebase"
import { collection, getDocs } from "firebase/firestore"
import { Calendar, User, MapPin, Users, Gift } from "lucide-react"

const ADMIN_EMAIL = "robertrenbysanjuan@gmail.com"

export default function AdminUpcoming() {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUpcoming = async () => {
    try {
      const snap = await getDocs(collection(db, "bookings"))
      const today = new Date()

      const events = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((b) => {
          if (b.status !== "accepted") return false
          if (!b.date) return false
          const eventDate = new Date(b.date)
          return eventDate >= today
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      setUpcoming(events)
    } catch (err) {
      console.error("Error fetching upcoming events:", err)
      alert("Failed to load upcoming events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcoming()
  }, [])

  const isAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL

  if (loading) {
    return <p className="p-6 text-gray-500">Loading upcoming events...</p>
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">
          You must log in as admin to view upcoming events.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>

      {upcoming.length === 0 ? (
        <p className="text-gray-500">No upcoming events yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e) => (
            <div
              key={e.id}
              className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition space-y-4 border border-gray-100"
            >
              {/* Header with Package */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                  <Gift size={18} /> {e.packageName || "Custom Package"}
                </h2>
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                  {e.status}
                </span>
              </div>

              {/* Client Info */}
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />{" "}
                  <span className="font-medium">{e.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" /> {e.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />{" "}
                  {e.venue || "No venue provided"}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />{" "}
                  {e.guests || 0} guests
                </p>
              </div>

              {/* Footer */}
              <div className="border-t pt-3 text-sm text-gray-500">
                <p>
                  Contact: <span className="font-medium">{e.email}</span>
                </p>
                <p>Phone: {e.phone || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
