import { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { X, ArrowLeft } from "lucide-react"

const localizer = momentLocalizer(moment)

function AdminCalendar() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Wedding Event",
      description: "Full wedding setup with sound, lights & catering",
      type: "wedding",
      start: new Date(2025, 8, 10, 14, 0),
      end: new Date(2025, 8, 10, 20, 0),
    },
    {
      id: 2,
      title: "Birthday Party",
      description: "Kids’ birthday with karaoke and balloons",
      type: "birthday",
      start: new Date(2025, 8, 12, 18, 0),
      end: new Date(2025, 8, 12, 23, 0),
    },
  ])

  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    type: "general",
  })

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end })
    setFormData({
      title: "",
      description: "",
      start: moment(start).format("YYYY-MM-DDTHH:mm"),
      end: moment(end).format("YYYY-MM-DDTHH:mm"),
      type: "general",
    })
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
      type: event.type || "general",
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                ...formData,
                start: new Date(formData.start),
                end: new Date(formData.end),
              }
            : ev
        )
      )
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
          start: new Date(formData.start),
          end: new Date(formData.end),
        },
      ])
    }
    setSelectedSlot(null)
    setSelectedEvent(null)
  }

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
      setSelectedEvent(null)
    }
  }

  // Custom event styling by type
  const eventStyleGetter = (event) => {
    let bg = "#4f46e5" // default indigo
    if (event.type === "wedding") bg = "#ec4899"
    if (event.type === "birthday") bg = "#3b82f6"
    if (event.type === "corporate") bg = "#10b981"
    return {
      style: {
        backgroundColor: bg,
        borderRadius: "8px",
        color: "white",
        padding: "4px",
      },
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-3xl font-bold text-indigo-700">Admin Calendar</h1>
      </div>

      {/* Instructions */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">How to schedule:</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Click on a date/time slot to create a new event.</li>
          <li>Click an existing event to edit or delete it.</li>
          <li>Choose event type (wedding, birthday, corporate, etc.) for colors.</li>
          <li>Provide clear details (title, description, start & end time).</li>
        </ul>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Modal */}
      {(selectedSlot || selectedEvent) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => {
                setSelectedSlot(null)
                setSelectedEvent(null)
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="e.g. John & Mary's Wedding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Details about the event..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Event Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="general">General</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={formData.start}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={formData.end}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSlot(null)
                    setSelectedEvent(null)
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedEvent ? "Save Changes" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCalendar
