import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, CreditCard, Star, Sparkles } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase"

function Recommendation() {
  const [guests, setGuests] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch packages from Firestore
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

  const handleSubmit = (e) => {
    e.preventDefault()

    const guestNum = parseInt(guests, 10)
    if (!guestNum || guestNum <= 0) {
      setRecommendations([])
      return
    }

    const recs = packages.filter((pkg) => {
      // Extract max guest number from capacity string (e.g. "Up to 1000 guests")
      const match = pkg.capacity?.match(/\d+/g)
      const maxGuests = match ? parseInt(match.pop(), 10) : Infinity
      return guestNum <= maxGuests
    })

    recs.sort((a, b) => {
      const maxA = parseInt(a.capacity?.match(/\d+/g)?.pop() ?? "99999", 10)
      const maxB = parseInt(b.capacity?.match(/\d+/g)?.pop() ?? "99999", 10)
      return maxA - maxB
    })

    setRecommendations(recs)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Smart Recommendations</h1>
        <p className="mt-3 text-gray-600 text-lg">
          Instantly find the best package for your event size & type.
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4 border rounded-2xl p-6 shadow-md bg-white"
      >
        <label className="block text-gray-700 font-medium">
          Number of Guests
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter guest count"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Loading Packages..." : "Get Recommendations"}
        </button>
      </form>

      {/* Results */}
      <AnimatePresence>
        {recommendations.length > 0 ? (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {recommendations.map((pkg) => (
              <motion.div
                key={pkg.id}
                className="p-6 rounded-2xl shadow-md text-white hover:shadow-lg transition bg-gradient-to-r"
                style={{
                  background: pkg.colorFrom
                    ? `linear-gradient(to right, ${pkg.colorFrom}, ${pkg.colorTo})`
                    : "linear-gradient(to right, #6366f1, #8b5cf6)",
                }}
                whileHover={{ scale: 1.03 }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  {pkg.name}
                </h3>

                <p className="mt-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {pkg.capacity}
                </p>
                <p className="mt-2 flex items-center gap-2 font-medium text-lg">
                  <CreditCard className="w-4 h-4" />
                  {pkg.price}
                </p>

                {pkg.recommendedEvent && (
                  <p className="mt-2 flex items-center gap-2 italic">
                    <Sparkles className="w-4 h-4" />
                    Recommended for: {pkg.recommendedEvent}
                  </p>
                )}

                {pkg.extras && (
                  <ul className="mt-4 list-disc list-inside space-y-1">
                    {pkg.extras.map((extra, i) => (
                      <li key={i}>{extra}</li>
                    ))}
                  </ul>
                )}

                <a
                  href={`/packages/${pkg.id}`}
                  className="mt-6 inline-block w-full text-center px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition"
                >
                  View Details
                </a>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Enter guest count to see recommendations ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Recommendation
