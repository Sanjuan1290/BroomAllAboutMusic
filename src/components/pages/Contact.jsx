import { useState } from "react";
import emailjs from "emailjs-com";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_mei2sff",
        "template_d0fvh2n",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: "BroomAllAboutMusic Message",
          message: form.message,
          time: new Date().toLocaleString(),
        },
        "gJflIZ_Q7NBFA8o83"
      )
      .then(
        () => {
          alert("Message sent! We'll get back to you soon.");
          setForm({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
        },
        (error) => {
          console.error("FAILED...", error);
          alert("Something went wrong. Please try again later.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="sm:text-4xl text-2xl font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="mt-3 text-gray-600 text-sm sm:text-base">
          Have questions or want to book a package? Reach out to us!
        </p>
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-5 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Get in Touch
          </h2>
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
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-5"
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
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
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
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
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
              className="mt-1 w-full px-4 py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Google Map */}
      <div>
        <iframe
          className="w-full rounded-xl shadow-md"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20495.35581969786!2d120.93025975!3d14.338781249999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d58cc7060449%3A0xba193d41bd00d36b!2sPCU%20Dasmari%C3%B1as%20College%20Building!5e1!3m2!1sen!2sph!4v1757570128903!5m2!1sen!2sph"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
