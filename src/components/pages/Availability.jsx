import { useState } from "react"
import { Link } from "react-router-dom"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"

const bookedDates = ["2025-09-15", "2025-09-24", "2025-10-01"]

function Availability() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Month days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isBooked = (date) =>
    bookedDates.includes(format(date, "yyyy-MM-dd"))

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Check Availability</h1>
        <p className="mt-2 text-gray-600">
          Choose your event date to continue with booking.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="md:col-span-2 border rounded-2xl shadow-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              ◀
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              ▶
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2 mt-2">
            {days.map((day) => {
              const booked = isBooked(day)
              const selected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={day}
                  onClick={() => !booked && setSelectedDate(day)}
                  className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200
                    ${
                      booked
                        ? "bg-red-100 text-red-600 border-red-300 cursor-not-allowed"
                        : "bg-green-50 hover:bg-green-100 border-green-300"
                    }
                    ${selected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                    ${isToday(day) ? "font-bold text-blue-700 border-blue-400" : ""}
                  `}
                  disabled={booked}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="border rounded-2xl shadow-lg p-6 bg-white space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Date Details</h2>
          {selectedDate ? (
            <>
              <div className="p-4 border rounded-xl bg-gray-50">
                <p className="text-gray-800">
                  <span className="font-medium">Selected Date:</span>{" "}
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
                {isBooked(selectedDate) ? (
                  <p className="text-red-600 font-medium mt-2">
                    ❌ Sorry, this date is already booked.
                  </p>
                ) : (
                  <p className="text-green-600 font-medium mt-2">
                    ✅ Great! This date is available for booking.
                  </p>
                )}
              </div>

              {!isBooked(selectedDate) && (
                <Link
                  to={`/packages`}
                  className="block w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white font-medium rounded-lg hover:opacity-90 transition"
                >
                  Proceed to Booking
                </Link>
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a date from the calendar.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Availability
