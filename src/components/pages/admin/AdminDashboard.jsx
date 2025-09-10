export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Total Packages</h2>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
          <p className="text-2xl font-bold mt-2">8</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Completed Events</h2>
          <p className="text-2xl font-bold mt-2">24</p>
        </div>
      </div>
    </div>
  )
}
