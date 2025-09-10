import { useState } from "react"
import { Pencil, Trash } from "lucide-react"

export default function AdminPackages() {
  const [packages, setPackages] = useState([
    { id: 1, name: "Basic Package", price: 500, capacity: 50 },
    { id: 2, name: "Premium Package", price: 1200, capacity: 150 },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", price: "", capacity: "", description: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newPackage = { id: Date.now(), ...formData }
    setPackages([...packages, newPackage])
    setFormData({ name: "", price: "", capacity: "", description: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Packages</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Add Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-4 bg-white shadow rounded-xl space-y-2">
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <p>💰 ${pkg.price}</p>
            <p>👥 {pkg.capacity} guests</p>

            <div className="flex gap-2 mt-3">
              <button className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-100">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Package</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block font-medium">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
