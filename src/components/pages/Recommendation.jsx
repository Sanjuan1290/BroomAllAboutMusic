import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, CreditCard, Star, Sparkles, AlertTriangle } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase"

// 3D
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture, Text } from "@react-three/drei"
import * as THREE from "three"

// 🏟️ Venue that changes based on guest count
function Venue3D({ guestCount }) {
  const courtTex = useTexture("/textures/court_texture.jpg")
  const hallTex = useTexture("/textures/hall_texture.png")
  const grandHallTex = useTexture("/textures/grandhall_texture.png")
  const stadiumTex = useTexture("/textures/stadium_texture.png")
  const specialTex = useTexture("/textures/stadium_texture.png")

  const fixTexture = (tex) => {
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.repeat.set(1, 1)
    tex.anisotropy = 16
    return tex
  }

  let venueType = "Court"
  let size = [30, 20]
  let floorTexture = fixTexture(courtTex)

  if (guestCount <= 100) {
    venueType = "Court"
    size = [30, 20]
    floorTexture = fixTexture(courtTex)
  } else if (guestCount <= 200) {
    venueType = "Banquet Hall"
    size = [50, 35]
    floorTexture = fixTexture(hallTex)
  } else if (guestCount <= 300) {
    venueType = "Grand Hall"
    size = [70, 50]
    floorTexture = fixTexture(grandHallTex)
  } else if (guestCount <= 1000) {
    venueType = "Stadium"
    size = [120, 90]
    floorTexture = fixTexture(stadiumTex)
  } else {
    venueType = "Special Arrangement"
    size = [150, 120]
    floorTexture = fixTexture(specialTex)
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Floating label */}
      <Text
        position={[0, 5, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.15}
        outlineColor="black"
      >
        {venueType}
      </Text>
    </group>
  )
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
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#444fff" />
      </mesh>
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
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

// 👥 Dynamic guests spread inside venue
function Guests({ count }) {
  const positions = useMemo(() => {
    const pos = []
    if (count <= 0) return pos

    let width = 30
    let depth = 20
    if (count <= 100) {
      width = 30
      depth = 20
    } else if (count <= 200) {
      width = 50
      depth = 35
    } else if (count <= 300) {
      width = 70
      depth = 50
    } else if (count <= 1000) {
      width = 120
      depth = 90
    } else {
      width = 150
      depth = 120
    }

    const cols = Math.ceil(Math.sqrt(count))
    const spacingX = width / cols
    const spacingZ = depth / cols

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = -width / 2 + col * spacingX + spacingX / 2
      const z = -depth / 2 + row * spacingZ + spacingZ / 2
      pos.push([x, 0.3, z])
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

// 🛠 Helper: parse package capacity
const parseCapacity = (cap) => {
  if (!cap) return Infinity
  if (typeof cap === "number") return cap
  const match = String(cap).match(/\d+/g)
  return match ? parseInt(match.pop(), 10) : Infinity
}

function Recommendation() {
  const [guests, setGuests] = useState("")
  const [warning, setWarning] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const MAX_GUESTS = 1000

  // Fetch packages once
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

  // Auto-update recommendations whenever guests/packages change
  useEffect(() => {
    const guestNum = parseInt(guests, 10)
    if (!guestNum || guestNum <= 0) {
      setRecommendations([])
      setSelectedPackage(null)
      return
    }

    const recs = packages.filter((pkg) => guestNum <= parseCapacity(pkg.capacity))
    recs.sort((a, b) => parseCapacity(a.capacity) - parseCapacity(b.capacity))

    setRecommendations(recs)
    if (recs.length > 0) setSelectedPackage(recs[0])
  }, [guests, packages])

  const speakerRange = selectedPackage
    ? parseCapacity(selectedPackage.capacity) / 20
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

      <div className="flex flex-col lg:flex-row items-center">
        {/* Step 1: Input */}
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700">
            Step 1: Enter Guests
          </h2>
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
        </div>

        {/* Step 2: 3D Visualization */}
        {parseInt(guests, 10) > 0 && (
          <div className="max-w-5xl mx-auto space-y-2">
            <h2 className="text-2xl font-semibold text-center text-indigo-700 mt-10">
              Step 2: Visualize in 3D
            </h2>
            <div className="h-[300px] w-[400px] sm:w-[500px] rounded-xl overflow-hidden shadow-lg border">
              <Canvas camera={{ position: [60, 40, 60], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 15, 5]} />
                <Venue3D guestCount={parseInt(guests, 10)} />
                <Speaker range={speakerRange} />
                <Guests count={parseInt(guests, 10)} />
                <OrbitControls enablePan enableZoom enableRotate />
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
                  onClick={() => {
                    setSelectedPackage(pkg)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
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
                    ₱{Number(pkg.price).toLocaleString()}
                  </p>
                  {pkg.recommendedEvent && (
                    <p className="mt-2 flex items-center gap-2 italic">
                      <Sparkles className="w-4 h-4" />
                      Perfect for:{" "}
                      {Array.isArray(pkg.recommendedEvent)
                        ? pkg.recommendedEvent.join(", ")
                        : pkg.recommendedEvent}
                    </p>
                  )}
                  {pkg.addOns && (
                    <ul className="mt-4 list-disc list-inside space-y-1">
                      {(Array.isArray(pkg.addOns)
                        ? pkg.addOns
                        : String(pkg.addOns).split(",")
                      ).map((extra, i) => (
                        <li key={i}>{extra.trim()}</li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <a
                    href={`/checkout/${pkg.id}`}
                    className="mt-6 inline-block px-4 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Book Now
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
