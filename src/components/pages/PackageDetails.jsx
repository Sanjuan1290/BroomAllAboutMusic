import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase"

function PackageDetails() {
  const { id } = useParams()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const docRef = doc(db, "packages", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setPkg({ id: docSnap.id, ...docSnap.data() })
        } else {
          setPkg(null)
        }
      } catch (err) {
        console.error("Error fetching package:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPackage()
  }, [id])

  if (loading) {
    return <p className="text-center text-gray-500 py-20">Loading package...</p>
  }

  if (!pkg) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">
          Package not found
        </h2>
        <Link
          to="/packages"
          className="mt-6 inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Back to Packages
        </Link>
      </div>
    )
  }

  // 🔧 helper: split strings into arrays
  const toList = (val) => {
    if (!val) return []
    if (typeof val === "string") {
      return val.split(",").map((v) => v.trim())
    }
    return []
  }

  const inclusions = toList(pkg.inclusion)
  const addOns = toList(pkg.addOns)
  const events = toList(pkg.recommendedEvent)

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-60 object-cover"
        />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {pkg.name}
        </h1>
        {pkg.capacity && (
          <p className="mt-2 text-gray-600">
            Capacity: {pkg.capacity} people
          </p>
        )}
        <p className="mt-4 text-2xl font-bold text-gray-900">
          ₱{pkg.price?.toLocaleString()}
        </p>
      </div>

      {/* Package Specs */}
      <div className="p-6 border rounded-2xl shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
        <ul className="space-y-2 text-gray-700">
          {pkg.duration && <li><strong>Duration:</strong> {pkg.duration} hrs</li>}
          {pkg.power && <li><strong>Total Power:</strong> {pkg.power}W</li>}
          {pkg.speakers && <li><strong>Speakers:</strong> {pkg.speakers}</li>}
          {events.length > 0 && (
            <li className="text-emerald-600 font-medium">
              <strong>Recommended For:</strong> {events.join(", ")}
            </li>
          )}
        </ul>
      </div>

      {/* Inclusions */}
      {inclusions.length > 0 && (
        <div className="p-6 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Inclusions</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            {inclusions.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 border-b pb-2 last:border-none"
              >
                <span className="text-lg">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add-Ons */}
      {addOns.length > 0 && (
        <div className="p-6 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Available Add-Ons</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            {addOns.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 border-b pb-2 last:border-none"
              >
                <span className="text-lg">➕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <Link
          to={`/checkout/${pkg.id}`}
          className="px-8 py-3 text-lg font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}

export default PackageDetails
