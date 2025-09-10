import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from "recharts"
import packages from "../../data/packagesData"

function EventCapacityVisualization() {
  const [guests, setGuests] = useState("")

  // Prepare chart data
  const data = packages.map((pkg) => {
    const match = pkg.capacity.match(/\d+/g)
    const maxGuests = match ? parseInt(match.pop(), 10) : 0
    return {
      name: pkg.name,
      capacity: maxGuests,
    }
  })

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Event Capacity Visualization
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          Compare your guest count against our package capacities to find the best fit.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-md mx-auto">
        <label className="block text-gray-700 font-medium">
          Number of Guests
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Enter guest count"
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </label>
      </div>

      {/* Chart */}
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="capacity" fill="#6366f1" name="Max Capacity" />

            {/* Show user’s guests as a line */}
            {guests && (
              <ReferenceLine
                y={parseInt(guests, 10)}
                stroke="red"
                strokeDasharray="4 4"
                label={{ value: `Your Guests: ${guests}`, position: "top", fill: "red" }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EventCapacityVisualization
