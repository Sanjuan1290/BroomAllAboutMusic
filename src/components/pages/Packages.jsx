import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase"

function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "packages"))
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPackages(data)
      } catch (err) {
        console.error("Error fetching packages:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Loading packages...</p>
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Packages
        </h1>
        <p className="mt-3 text-gray-600">
          Choose the perfect sound system package with style, features, and
          capacity for your event.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white flex flex-col"
          >
            {/* Image */}
            <div
              className="relative h-40 w-full overflow-hidden"
              style={{
                background: pkg.colorFrom
                  ? `linear-gradient(to right, ${pkg.colorFrom}, ${pkg.colorTo})`
                  : "#f3f4f6",
              }}
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-full w-full object-cover mix-blend-multiply"
              />
              {/* Recommended Event Badge */}
              {pkg.recommendedEvent && (
                <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  🎉 {pkg.recommendedEvent}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              <p className="mt-3 text-gray-600 text-sm">{pkg.description}</p>

              <div className="mt-6">
                <p className="text-2xl font-bold text-gray-900">{pkg.price}</p>
                <a
                  href={`/packages/${pkg.id}`}
                  className="mt-4 inline-block w-full text-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Packages
