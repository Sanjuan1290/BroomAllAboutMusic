import { useState } from "react"
import { Package, Plus, Pencil, Trash, X, ArrowLeft } from "lucide-react"
import packagesData from "../../../data/packagesData"

function AdminPackages() {
  const [packages, setPackages] = useState(packagesData)
  const [editingPackage, setEditingPackage] = useState(null) // track whether editing or adding
  const [formData, setFormData] = useState({})

  // Open "Add Package" modal
  const handleAdd = () => {
    setEditingPackage("new") // mark as adding
    setFormData({
      id: null,
      name: "",
      capacity: "",
      price: "",
      recommendedEvent: "",
      colorFrom: "#000000",
      colorTo: "#000000",
      image: "",
    })
  }

  // Open "Edit Package" modal
  const handleEdit = (id) => {
    const pkg = packages.find((p) => p.id === id)
    if (pkg) {
      setEditingPackage("edit")
      setFormData({ ...pkg })
    }
  }

  // Delete a package
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPackages((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle saving package
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (editingPackage === "edit") {
      // Update existing
      setPackages((prev) =>
        prev.map((p) => (p.id === formData.id ? { ...formData } : p))
      )
    } else {
      // Add new
      const newId = packages.length ? Math.max(...packages.map((p) => p.id)) + 1 : 1
      setPackages((prev) => [...prev, { ...formData, id: newId }])
    }
    setEditingPackage(null)
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> Manage Packages
          </h1>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
          >
            {/* Image */}
            <div
              style={{
                background: `linear-gradient(to right, ${pkg.colorFrom}, ${pkg.colorTo})`,
              }}
              className="h-40 rounded-lg flex items-center justify-center"
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-24 object-contain drop-shadow-lg"
              />
            </div>

            {/* Package Info */}
            <div className="mt-4">
              <h2 className="font-bold text-lg">{pkg.name}</h2>
              <p className="text-gray-600 text-sm">{pkg.capacity}</p>
              <p className="font-semibold text-indigo-600 mt-1">{pkg.price}</p>
              <p className="text-gray-500 text-sm mt-2">
                {pkg.recommendedEvent}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(pkg.id)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded flex items-center gap-1"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded flex items-center gap-1"
              >
                <Trash size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close */}
            <button
              onClick={() => setEditingPackage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingPackage === "edit" ? "Edit Package" : "Add Package"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Capacity</label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Recommended Event
                </label>
                <input
                  type="text"
                  name="recommendedEvent"
                  value={formData.recommendedEvent || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Color From</label>
                  <input
                    type="color"
                    name="colorFrom"
                    value={formData.colorFrom || "#000000"}
                    onChange={handleFormChange}
                    className="w-full h-10 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">Color To</label>
                  <input
                    type="color"
                    name="colorTo"
                    value={formData.colorTo || "#000000"}
                    onChange={handleFormChange}
                    className="w-full h-10 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {editingPackage === "edit" ? "Save Changes" : "Add Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPackages
