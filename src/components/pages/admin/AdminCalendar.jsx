export default function AdminCalendar() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Availability Calendar</h1>
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-600">
          📅 Calendar component will go here (for setting unavailable dates).
        </p>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Mark Date as Unavailable
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  )
}
