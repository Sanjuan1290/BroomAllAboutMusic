export default function AdminUpcoming() {
  const dummyUpcoming = [
    { id: 1, client: "Carlos", package: "Premium", date: "2025-09-20" },
    { id: 2, client: "Maria", package: "Basic", date: "2025-09-25" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dummyUpcoming.map((e) => (
          <div key={e.id} className="p-4 bg-white rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold">{e.package}</h2>
            <p>👤 {e.client}</p>
            <p>📅 {e.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
