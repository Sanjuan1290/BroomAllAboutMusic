import { Calendar, ArrowLeft, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

function AdminCalendar() {
  const navigate = useNavigate()

  // Dummy events (replace with Firestore later)
  const events = [
    { id: 1, title: "Wedding Event", date: "2025-09-15", time: "4:00 PM", package: "Premium Package" },
    { id: 2, title: "Corporate Seminar", date: "2025-09-20", time: "9:00 AM", package: "Corporate Package" },
    { id: 3, title: "Birthday Party", date: "2025-09-25", time: "6:00 PM", package: "Basic Package" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar /> Event Calendar
          </h1>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50"
            >
              <div>
                <h2 className="font-semibold text-lg">{event.title}</h2>
                <p className="text-gray-600 text-sm">{event.package}</p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2 text-gray-700 text-sm">
                <Clock size={16} />
                <span>
                  {event.date} • {event.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminCalendar
