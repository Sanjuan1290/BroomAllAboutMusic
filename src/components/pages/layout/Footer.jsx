import {  NavLink } from "react-router-dom"
import {
  Facebook,
  Instagram,
  Phone,
} from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
          {/* Left */}
          <div>
            <p className="font-bold text-white text-lg">BROOM</p>
            <p className="mt-2 text-sm">All About Music</p>
          </div>

          {/* Center links + socials */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <NavLink
                to="/policy"
                className="hover:text-white transition duration-300"
              >
                Policy
              </NavLink>
              <NavLink
                to="/contact"
                className="hover:text-white transition duration-300"
              >
                Contact
              </NavLink>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-pink-400 transition duration-300 transform hover:scale-110"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="hover:text-pink-400 transition duration-300 transform hover:scale-110"
              >
                <Instagram />
              </a>
              <a
                href="tel:+639123456789"
                className="hover:text-pink-400 transition duration-300 transform hover:scale-110"
              >
                <Phone />
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="text-right text-sm">
            <p>&copy; {new Date().getFullYear()} BROOM. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer