export default function AdminBookings() {
  const dummyBookings = [
    { id: 1, client: "John Doe", package: "Premium Package", date: "2025-09-12", status: "Pending" },
    { id: 2, client: "Jane Smith", package: "Basic Package", date: "2025-09-18", status: "Pending" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Package</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyBookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.client}</td>
                <td className="p-3">{b.package}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.status}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Reject
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
