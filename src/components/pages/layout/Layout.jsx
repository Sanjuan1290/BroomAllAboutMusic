import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

function Layout() {
  const location = useLocation()

  // Check if the current route starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hide header & footer if on /admin pages */}
      {!isAdminRoute && <Header />}

      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default Layout
