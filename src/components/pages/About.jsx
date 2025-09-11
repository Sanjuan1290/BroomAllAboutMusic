import { useState } from "react"

const faqs = [
  { q: "What services do you offer?", a: "We provide live music entertainment, sound system rentals, and customizable event packages tailored to weddings, birthdays, and corporate events." },
  { q: "How do I book a package?", a: "You can book directly through our website by choosing a package, selecting your date, and submitting your details. Our admin will confirm your booking shortly after." },
  { q: "Do you require a down payment?", a: "Yes, a down payment is required to secure your booking. The exact amount will be discussed once your booking is confirmed." },
  { q: "Can I customize a package?", a: "Absolutely! We offer flexibility to adjust packages based on your budget, guest count, and event preferences." },
  { q: "What happens if my event date is already taken?", a: "Our calendar shows availability in real-time. If your date is unavailable, we’ll help you find the next best option." },
  { q: "Do you provide equipment?", a: "Yes, our packages include professional sound equipment and technical support to ensure top-quality performance." },
  { q: "How far in advance should I book?", a: "We recommend booking at least 1–3 months in advance to ensure your preferred date and package are available." },
  { q: "Do you handle outdoor events?", a: "Yes! We are equipped for both indoor and outdoor events, with weather considerations in mind." },
  { q: "What payment methods do you accept?", a: "We accept cash, bank transfer, and online payment options. Full details will be provided during the booking process." },
  { q: "How can I contact your team?", a: "You can reach us via our Contact page, email, or phone. We’re always happy to assist!" },
]

const About = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Welcome to <span className="font-semibold">Broom All About Music</span> — 
            where unforgettable moments are brought to life through sound, rhythm, 
            and unforgettable event experiences.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-2">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-3">🎯 Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To deliver world-class music entertainment and event solutions that 
            make every occasion memorable, while providing clients with 
            professional and hassle-free booking experiences.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-3">🌟 Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the leading music and events service provider in the region, 
            known for creativity, reliability, and innovation that bring people together.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">🎵 Expert Musicians</h3>
              <p className="text-gray-600">
                A team of passionate professionals dedicated to delivering top-quality performances.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">💡 Custom Packages</h3>
              <p className="text-gray-600">
                Flexible options tailored to fit your event’s unique needs and budget.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">📅 Easy Booking</h3>
              <p className="text-gray-600">
                A smooth, hassle-free booking system that saves you time and energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{faq.q}</h3>
                <span>{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && (
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to make your event unforgettable?
        </h2>
        <p className="text-gray-600 mb-6">
          Explore our packages or contact us today to get started.
        </p>
        <a
          href="/packages"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          View Packages
        </a>
      </section>
    </div>
  )
}

export default About
