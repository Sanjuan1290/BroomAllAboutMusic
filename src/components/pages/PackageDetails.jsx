import { useParams, Link } from "react-router-dom"
import packages from "../../data/packagesData"


function PackageDetails() {
  const { id } = useParams()
  const pkg = packages.find((p) => p.id === parseInt(id))

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
        <p className="mt-2 text-gray-600">{pkg.capacity}</p>
        <p className="mt-4 text-2xl font-bold text-gray-900">{pkg.price}</p>
      </div>

      {/* Package Specs */}
      <div className="p-6 border rounded-2xl shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Duration:</strong> {pkg.duration}</li>
          <li><strong>Total Power:</strong> {pkg.power}</li>
          <li><strong>Speakers:</strong> {pkg.speakers}</li>
          <li><strong>Microphones:</strong> {pkg.microphones}</li>
          <li><strong>Subwoofers:</strong> {pkg.subwoofers}</li>
          <li><strong>Lighting:</strong> {pkg.lighting}</li>
          <li><strong>Technician:</strong> {pkg.technician}</li>
          <li className="text-emerald-600 font-medium">
            <strong>Recommended For:</strong> {pkg.recommendedEvent}
          </li>
        </ul>
      </div>

      {/* Extras */}
      {pkg.extras && (
        <div className="p-6 border rounded-2xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Extras</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            {pkg.extras.map((extra, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 border-b pb-2 last:border-none"
              >
                <span className="text-lg">✅</span>
                <span>{extra}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <Link
          to={`/checkout/${pkg.id}`}
          className={`px-8 py-3 text-lg font-medium text-white rounded-lg bg-gradient-to-r ${pkg.color} hover:opacity-90 transition`}
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}

export default PackageDetails
