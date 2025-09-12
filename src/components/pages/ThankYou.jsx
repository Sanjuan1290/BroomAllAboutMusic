import { Link } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center space-y-6 animate-fadeIn">
        {/* ✅ Success Icon */}
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
        </div>

        {/* 🎉 Heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Thank You for Your Booking! 🎉
        </h1>

        {/* 📄 Message */}
        <p className="text-gray-600">
          We’ve received your booking details and our team will contact you soon
          to confirm everything.  
          You’ll also get an email with your booking information.
        </p>

        {/* 🔘 Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
