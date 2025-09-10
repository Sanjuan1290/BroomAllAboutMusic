import { useState, useEffect } from "react"
import { Package, PlusCircle, Trash, Edit, Save, X, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase"

function AdminPackages() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    price: "",
    recommendedEvent: "",
    extras: "",
  })

  // Fetch packages from Firestore
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "packages"))
        setPackages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error("Error fetching packages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Add or update package
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateDoc(doc(db, "packages", editingId), {
          ...form,
          extras: form.extras.split(",").map((s) => s.trim()),
        })
        setPackages((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
        )
        setEditingId(null)
      } else {
        const docRef = await addDoc(collection(db, "packages"), {
          ...form,
          extras: form.extras.split(",").map((s) => s.trim()),
        })
        setPackages((prev) => [...prev, { id: docRef.id, ...form }])
      }
      setForm({ name: "", capacity: "", price: "", recommendedEvent: "", extras: "" })
    } catch (err) {
      console.error("Error saving package:", err)
    }
  }

  // Delete package
  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return
    try {
      await deleteDoc(doc(db, "packages", id))
      setPackages((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting package:", err)
    }
  }

  // Edit package
  const handleEdit = (pkg) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name || "",
      capacity: pkg.capacity || "",
      price: pkg.price || "",
      recommendedEvent: pkg.recommendedEvent || "",
      extras: pkg.extras ? pkg.extras.join(", ") : "",
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> Manage Packages
          </h1>
        </div>
      </div>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {editingId ? <Edit size={18} /> : <PlusCircle size={18} />}
          {editingId ? "Edit Package" : "Add New Package"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Package Name"
            className="px-3 py-2 border rounded-lg w-full"
            required
          />
          <input
            type="text"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity (e.g. up to 100 guests)"
            className="px-3 py-2 border rounded-lg w-full"
            required
          />
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (e.g. $500)"
            className="px-3 py-2 border rounded-lg w-full"
            required
          />
          <input
            type="text"
            name="recommendedEvent"
            value={form.recommendedEvent}
            onChange={handleChange}
            placeholder="Recommended Event (optional)"
            className="px-3 py-2 border rounded-lg w-full"
          />
        </div>

        <textarea
          name="extras"
          value={form.extras}
          onChange={handleChange}
          placeholder="Extras (comma separated)"
          className="px-3 py-2 border rounded-lg w-full"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            {editingId ? <Save size={16} /> : <PlusCircle size={16} />}
            {editingId ? "Save Changes" : "Add Package"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm({ name: "", capacity: "", price: "", recommendedEvent: "", extras: "" })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* Package List */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Capacity</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">Event</th>
              <th className="p-3 border-b">Extras</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading packages...
                </td>
              </tr>
            )}
            {!loading && packages.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No packages found.
                </td>
              </tr>
            )}
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{pkg.name}</td>
                <td className="p-3 border-b">{pkg.capacity}</td>
                <td className="p-3 border-b">{pkg.price}</td>
                <td className="p-3 border-b">{pkg.recommendedEvent || "—"}</td>
                <td className="p-3 border-b">
                  {pkg.extras ? pkg.extras.join(", ") : "—"}
                </td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    <Trash size={14} /> Delete
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

export default AdminPackages
