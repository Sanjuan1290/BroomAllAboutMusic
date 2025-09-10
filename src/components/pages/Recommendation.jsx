import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, CreditCard, Star, Sparkles, AlertTriangle } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase"

// 3D
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"
import * as THREE from "three"

// 🏀 Dynamic multi-court floor
function MultiCourt({ guestCount }) {
  const courtTexture = useTexture("/textures/court_texture.jpg")
  courtTexture.wrapS = THREE.ClampToEdgeWrapping
  courtTexture.wrapT = THREE.ClampToEdgeWrapping
  courtTexture.anisotropy = 16

  const capacityPerCourt = 100
  const courtCount = Math.ceil(guestCount / capacityPerCourt)
  const gridSize = Math.ceil(Math.sqrt(courtCount))

  const courts = []
  let index = 0
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (index >= courtCount) break

      // offset so the grid is centered
      const offsetX = (col - (gridSize - 1) / 2) * 32
      const offsetZ = (row - (gridSize - 1) / 2) * 22

      courts.push(
        <mesh
          key={index}
          position={[offsetX, 0, offsetZ]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial map={courtTexture} />
        </mesh>
      )
      index++
    }
  }

  return <group>{courts}</group>
}


// 🔊 Speaker with pulsing waves
function Speaker({ range }) {
  const pulseRef = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pulseRef.current) {
      const s = 1 + 0.1 * Math.sin(t * 2)
      pulseRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={[0, 0.5, -8]}>
      {/* Stage */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#444fff" />
      </mesh>

      {/* Speaker */}
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      {/* Pulsing Sound Coverage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={pulseRef}>
        <circleGeometry args={[range, 64]} />
        <meshBasicMaterial
          color="blue"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// 👥 Dynamic guests spread across multiple courts
function Guests({ count }) {
  const capacityPerCourt = 100
  const courtCount = Math.ceil(count / capacityPerCourt)
  const gridSize = Math.ceil(Math.sqrt(courtCount))

  const positions = useMemo(() => {
    const pos = []
    let guestIndex = 0

    for (let courtRow = 0; courtRow < gridSize; courtRow++) {
      for (let courtCol = 0; courtCol < gridSize; courtCol++) {
        if (guestIndex >= count) break

        // offset for each court (same as MultiCourt)
        const offsetX = (courtCol - (gridSize - 1) / 2) * 32
        const offsetZ = (courtRow - (gridSize - 1) / 2) * 22

        // place up to 100 guests on this court
        const guestsOnThisCourt = Math.min(
          capacityPerCourt,
          count - guestIndex
        )

        const cols = 10
        for (let i = 0; i < guestsOnThisCourt; i++) {
          const row = Math.floor(i / cols)
          const col = i % cols
          const x = -9 + col * 2 + offsetX
          const z = 7 - row * 2 + offsetZ
          pos.push([x, 0.3, z])
        }

        guestIndex += guestsOnThisCourt
      }
    }

    return pos
  }, [count])

  return positions.map((pos, i) => (
    <mesh key={i} position={pos}>
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshStandardMaterial color={i % 2 === 0 ? "orange" : "teal"} />
    </mesh>
  ))
}


function Recommendation() {
  const [guests, setGuests] = useState("")
  const [warning, setWarning] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const MAX_GUESTS = 1000

  // Fetch packages
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
    if (recs.length > 0) setSelectedPackage(recs[0])
  }

  // Speaker range = based on selected package capacity
  const speakerRange = selectedPackage
    ? parseInt(selectedPackage.capacity?.match(/\d+/g)?.pop() ?? "10", 10) / 20
    : 10

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Event Smart Planner (3D)
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Enter guest size, explore the event space in 3D, and instantly see
          which package fits best.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row  items-center ">
        {/* Step 1: Input */}
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700">
            Step 1: Enter Guests
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              value={guests}
              onChange={(e) => {
                let val = parseInt(e.target.value || "0", 10)
                if (val > MAX_GUESTS) {
                  val = MAX_GUESTS
                  setWarning(`⚠️ Maximum allowed guests is ${MAX_GUESTS}.`)
                } else {
                  setWarning("")
                }
                setGuests(val.toString())
              }}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder={`e.g. 250 (max ${MAX_GUESTS})`}
            />
            {warning && (
              <p className="flex items-center text-yellow-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" /> {warning}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Show Results"}
            </button>
          </form>
        </div>

        {/* Step 2: 3D Visualization */}
        {guests && (
          <div className="max-w-5xl mx-auto space-y-2">
            <h2 className="text-2xl font-semibold text-center text-indigo-700 mt-10">
              Step 2: Visualize in 3D
            </h2>
            <div className="h-[300px] w-[400px] sm:w-[500px] rounded-xl overflow-hidden shadow-lg border">
              <Canvas camera={{ position: [40, 30, 40], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 15, 5]} />

                {/* Basketball Courts */}
                <MultiCourt guestCount={parseInt(guests, 10)} />

                {/* Speaker */}
                <Speaker range={speakerRange} />

                {/* Guests */}
                <Guests count={parseInt(guests, 10)} />

                {/* Full camera controls */}
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-indigo-700">
          Step 3: Recommended Packages
        </h2>
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
                  className={`p-6 rounded-3xl shadow-lg text-white hover:shadow-2xl transition cursor-pointer ${
                    selectedPackage?.id === pkg.id ? "ring-4 ring-yellow-400" : ""
                  }`}
                  style={{
                    background: pkg.colorFrom
                      ? `linear-gradient(to right, ${pkg.colorFrom}, ${pkg.colorTo})`
                      : "linear-gradient(to right, #6366f1, #8b5cf6)",
                  }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <h3 className="text-2xl font-bold flex items-center gap-2">
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
                      Perfect for: {pkg.recommendedEvent}
                    </p>
                  )}

                  {pkg.extras && (
                    <ul className="mt-4 list-disc list-inside space-y-1">
                      {pkg.extras.map((extra, i) => (
                        <li key={i}>{extra}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {guests
                ? "No suitable packages found ❌"
                : "Enter guest count to see recommendations ✨"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Recommendation
