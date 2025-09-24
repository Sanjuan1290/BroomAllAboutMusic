import { NavLink } from "react-router-dom"
import { Facebook, Instagram, Phone } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 text-center md:text-left">
        
        {/* Left */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className="font-bold text-white text-lg">BROOM</p>
          <p className="text-sm">All About Music</p>
        </div>

        {/* Center links + socials */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
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
          <div className="flex space-x-6">
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
        <div className="flex flex-col items-center md:items-end text-sm">
          <p className="border-t md:border-none border-gray-700 pt-4 md:pt-0 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} BROOM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
