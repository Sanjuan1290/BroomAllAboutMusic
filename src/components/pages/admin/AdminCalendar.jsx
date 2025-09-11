import { useState, useEffect } from "react"
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
import { db } from "../../../firebase"
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore"

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [unavailableDates, setUnavailableDates] = useState([])

  // Fetch unavailable dates from Firestore
  const fetchUnavailableDates = async () => {
    try {
      const snap = await getDocs(collection(db, "unavailableDates"))
      setUnavailableDates(snap.docs.map((d) => d.id)) // store IDs as YYYY-MM-DD
    } catch (err) {
      console.error("Error fetching unavailable dates:", err)
    }
  }

  useEffect(() => {
    fetchUnavailableDates()
  }, [])

  const isUnavailable = (date) =>
    unavailableDates.includes(format(date, "yyyy-MM-dd"))

  // Mark date as unavailable in Firestore
  const markUnavailable = async () => {
    if (!selectedDate) return
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    try {
      await setDoc(doc(db, "unavailableDates", dateStr), { date: dateStr })
      setUnavailableDates((prev) => [...prev, dateStr])
      setSelectedDate(null)
    } catch (err) {
      console.error("Error marking unavailable:", err)
    }
  }

  // Clear date from unavailable
  const clearUnavailable = async () => {
    if (!selectedDate) return
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    try {
      await deleteDoc(doc(db, "unavailableDates", dateStr))
      setUnavailableDates((prev) => prev.filter((d) => d !== dateStr))
      setSelectedDate(null)
    } catch (err) {
      console.error("Error clearing unavailable:", err)
    }
  }

  // Month days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Availability Calendar
        </h1>
        <p className="mt-2 text-gray-600">
          Admin can manage unavailable dates here.
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
              const unavailable = isUnavailable(day)
              const selected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200
                    ${
                      unavailable
                        ? "bg-red-100 text-red-600 border-red-300"
                        : "bg-green-50 hover:bg-green-100 border-green-300"
                    }
                    ${selected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                    ${isToday(day) ? "font-bold text-blue-700 border-blue-400" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>
        </div>

        {/* Admin Control Panel */}
        <div className="border rounded-2xl shadow-lg p-6 bg-white space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Date Controls</h2>
          {selectedDate ? (
            <div className="p-4 border rounded-xl bg-gray-50">
              <p className="text-gray-800">
                <span className="font-medium">Selected Date:</span>{" "}
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
              {isUnavailable(selectedDate) ? (
                <p className="text-red-600 font-medium mt-2">
                  ❌ This date is marked unavailable.
                </p>
              ) : (
                <p className="text-green-600 font-medium mt-2">
                  ✅ This date is currently available.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a date from the calendar.</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={markUnavailable}
              disabled={!selectedDate || isUnavailable(selectedDate)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Unavailable
            </button>
            <button
              onClick={clearUnavailable}
              disabled={!selectedDate || !isUnavailable(selectedDate)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
