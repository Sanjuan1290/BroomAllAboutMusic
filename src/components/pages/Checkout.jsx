import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { db } from "../../firebase"
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore"

function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState(null)
  const [otherPackages, setOtherPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventType: "",
    venue: "",
    guests: "",
  })

  // Fetch selected package + other packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const docRef = doc(db, "packages", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPkg({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Package not found")
        }

        const querySnap = await getDocs(collection(db, "packages"))
        const allPkgs = querySnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setOtherPackages(allPkgs.filter((p) => p.id !== id))
      } catch (err) {
        console.error("Error fetching packages:", err)
        setError("Failed to load package")
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pkg) return

    try {
      await addDoc(collection(db, "bookings"), {
        ...form,
        packageId: pkg.id,
        packageName: pkg.name,
        status: "pending",
        createdAt: new Date(),
      })

      // Redirect with confirmation
      navigate("/thank-you", {
        state: { packageName: pkg.name, name: form.name },
      })
    } catch (err) {
      console.error("Error saving booking:", err)
      alert("Failed to submit booking. Try again later.")
    }
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading package...</p>
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        <Link
          to="/packages"
          className="mt-6 inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Booking Request</h1>
        <p className="mt-2 text-gray-600">
          Review your package and submit your details.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Package Summary */}
        <div className="border rounded-xl p-6 shadow-sm bg-white space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Package Summary</h2>
          <p className="text-lg font-medium text-gray-700">{pkg.name}</p>
          <p className="text-gray-600">{pkg.capacity}</p>
          <p className="text-2xl font-bold text-indigo-600">{pkg.price}</p>

          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong>Duration:</strong> {pkg.duration}</p>
            <p><strong>Total Power:</strong> {pkg.power}</p>
            <p><strong>Speakers:</strong> {pkg.speakers}</p>
            <p><strong>Microphones:</strong> {pkg.microphones}</p>
            <p><strong>Subwoofers:</strong> {pkg.subwoofers}</p>
            <p><strong>Lighting:</strong> {pkg.lighting}</p>
            <p><strong>Technician:</strong> {pkg.technician}</p>
          </div>

          {pkg.extras && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700">Extras:</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {pkg.extras.map((extra, idx) => (
                  <li key={idx}>{extra}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 border rounded-lg p-3 mt-4 text-sm text-gray-600">
            <p>
              <strong>Note:</strong> Extra equipment or hours may have
              additional charges. Our staff will confirm details after
              your booking.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="border rounded-xl p-6 shadow-sm bg-white space-y-5"
        >
          <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="text"
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            placeholder="Event Type (e.g., Wedding, Birthday)"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue Address"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            placeholder="Number of Guests"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Submit Booking Request
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            After submitting, our team will reach out to confirm your booking
            and finalize arrangements offline.
          </p>
        </form>
      </div>

      {/* Other Packages Section */}
      {otherPackages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Other Packages
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {otherPackages.map((altPkg) => (
              <div
                key={altPkg.id}
                className="border rounded-xl p-5 bg-white shadow hover:shadow-md transition flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {altPkg.name}
                </h3>
                <p className="text-gray-600">{altPkg.capacity}</p>
                <p className="text-indigo-600 font-bold text-lg">
                  {altPkg.price}
                </p>

                <Link
                  to={`/checkout/${altPkg.id}`}
                  className="mt-4 inline-block text-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Select Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
