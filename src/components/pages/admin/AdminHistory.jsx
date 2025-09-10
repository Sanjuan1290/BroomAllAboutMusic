export default function AdminHistory() {
  const dummyHistory = [
    { id: 1, client: "Ana", package: "Premium", date: "2025-08-01", status: "Completed" },
    { id: 2, client: "Mark", package: "Basic", date: "2025-08-12", status: "Cancelled" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking History</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Package</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyHistory.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="p-3">{h.client}</td>
                <td className="p-3">{h.package}</td>
                <td className="p-3">{h.date}</td>
                <td className="p-3">{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
