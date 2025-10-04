import { Music, Box, CalendarCheck } from "lucide-react" // icons

function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold">
          Sound System Rentals Made Simple
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm  sm:text-lg opacity-90">
          BROOM All About Music gives you reliable sound system rentals with
          event-capacity visualization, smart package recommendations, and
          hassle-free booking.
        </p>
        <div className="mt-6 space-x-4">
          <a
            href="/packages"
            className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg shadow hover:bg-gray-100"
          >
            View Packages
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-10 md:grid-cols-3">
        <div className="p-6 border rounded-xl text-center shadow hover:shadow-md transition">
          <Box className="mx-auto h-10 w-10 text-teal-600" />
          <h3 className="mt-4 font-semibold text-lg text-gray-800">Packages</h3>
          <p className="mt-2 text-gray-600">
            Choose from flexible sound system packages tailored to your event size.
          </p>
        </div>
        <div className="p-6 border rounded-xl text-center shadow hover:shadow-md transition">
          <Music className="mx-auto h-10 w-10 text-teal-600" />
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Smart Recommendations
          </h3>
          <p className="mt-2 text-gray-600">
            Get intelligent suggestions based on your event capacity and needs.
          </p>
        </div>
        <div className="p-6 border rounded-xl text-center shadow hover:shadow-md transition">
          <CalendarCheck className="mx-auto h-10 w-10 text-teal-600" />
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Real-Time Availability
          </h3>
          <p className="mt-2 text-gray-600">
            Check schedules instantly and book without waiting.
          </p>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="bg-gray-50 rounded-xl p-12 text-center shadow">
        <h2 className="text-2xl font-semibold text-gray-800">
          Ready to book your next event?
        </h2>
        <p className="mt-2 text-gray-600">
          Let us handle the sound so you can focus on the music.
        </p>
        <a
          href="/availability"
          className="mt-6 inline-block px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Check Availability
        </a>
      </section>

      {/* Reviews Carousel */}
<section className="py-16 overflow-hidden">
  <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
    What Our Clients Say
  </h2>

  <div className="relative">
    <div
      className="flex space-x-6"
      style={{
        width: "max-content",
        animation: "scrollLeft 25s linear infinite",
      }}
    >
      {[
        "BROOM handled our wedding reception flawlessly. The sound was crystal clear!",
        "Very professional and reliable team. Setup was on time and seamless!",
        "The bass was insane! Our corporate event felt like a concert.",
        "Easy booking process and great communication throughout.",
        "They really understand music needs — perfect for DJs!",
        "We rented for a school event and everyone loved the clarity.",
        "Great package recommendations. Saved me a ton of time!",
        "Honestly the best sound rental I’ve used in years.",
        "Friendly crew and high-quality equipment.",
        "Five stars. Will definitely book again for the next gig!",
      ]
        // Duplicate reviews for seamless loop
        .concat([
          "BROOM handled our wedding reception flawlessly. The sound was crystal clear!",
          "Very professional and reliable team. Setup was on time and seamless!",
          "The bass was insane! Our corporate event felt like a concert.",
          "Easy booking process and great communication throughout.",
          "They really understand music needs — perfect for DJs!",
          "We rented for a school event and everyone loved the clarity.",
          "Great package recommendations. Saved me a ton of time!",
          "Honestly the best sound rental I’ve used in years.",
          "Friendly crew and high-quality equipment.",
          "Five stars. Will definitely book again for the next gig!",
        ])
        .map((feedback, i) => (
          <div
            key={i}
            className="min-w-[300px] max-w-[300px] p-6 border rounded-xl bg-white shadow text-center"
          >
            <div className="flex justify-center mb-2">
              {"★★★★★".split("").map((s, idx) => (
                <span key={idx} className="text-yellow-500 text-lg">★</span>
              ))}
            </div>
            <p className="text-gray-600 italic">“{feedback}”</p>
          </div>
        ))}
    </div>
  </div>

  {/* Inline keyframes */}
  <style>{`
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
</section>

    </div>
  )
}

export default Home
