import { useState } from "react"

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Message sent! We'll get back to you soon.")
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          Have questions or want to book a package? Reach out to us!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
          <p className="text-gray-700">
            <span className="font-semibold">📍 Address:</span> 123 Music Lane,
            Manila, Philippines
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">📞 Phone:</span> +63 912 345 6789
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">📧 Email:</span>{" "}
            info@broomallmusic.com
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
