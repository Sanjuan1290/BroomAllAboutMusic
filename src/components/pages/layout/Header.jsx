import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" }, // ✅ Added About
  { to: "/packages", label: "Packages" },
  { to: "/recommendation", label: "Recommendations" },
  { to: "/availability", label: "Availability" },
  { to: "/contact", label: "Contact" },
]

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-4 p-4 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2 gap-2">
          <img src="/logo.png" alt="logo" className="w-14 h-14 rounded-full" />
          <span className="font-bold tracking-wide text-[14px] md:text-[12px] lg:text-[14px]">
            BROOM ALL ABOUT MUSIC
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold underline underline-offset-4"
                  : "hover:opacity-80 transition duration-300"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden text-white transition duration-300 hover:scale-110"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
          >
            <nav className="px-4 py-3 space-y-3">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "block font-semibold underline"
                      : "block hover:opacity-80 transition duration-300"
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
