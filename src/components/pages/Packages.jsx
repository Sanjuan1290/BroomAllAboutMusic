import packages from "../../data/packagesData"

function Packages() {
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
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-full w-full object-cover"
              />
              {/* Recommended Event Badge */}
              <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                🎉 {pkg.recommendedEvent}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              <p className="mt-3 text-gray-600 text-sm">{pkg.description}</p>

              <div className="mt-6">
                <p className="text-2xl font-bold text-gray-900">{pkg.price}</p>
                <a
                  href={`/packages/${pkg.id}`}
                  className={`mt-4 inline-block w-full text-center px-4 py-2 rounded-lg text-white bg-gradient-to-r ${pkg.color} hover:opacity-90 transition`}
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
