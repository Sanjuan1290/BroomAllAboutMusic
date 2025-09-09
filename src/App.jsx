import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"

// Layout
import Layout from "./components/pages/layout/Layout"

// Public pages
import Home from "./components/pages/Home"
import Packages from "./components/pages/Packages"
import Recommendation from "./components/pages/Recommendation"
import Availability from "./components/pages/Availability"
import PackageDetails from "./components/pages/PackageDetails"
import Checkout from "./components/pages/Checkout"
import Contact from "./components/pages/Contact"
import Policy from "./components/pages/Policy"
import Page404 from "./components/pages/Page404"

// Auth
import Login from "./components/pages/auth/Login"

// Admin
import AdminDashboard from "./components/pages/admin/AdminDashboard"
import AdminPackages from "./components/pages/admin/AdminPackages"
import AdminBookings from "./components/pages/admin/AdminBookings"
import AdminCalendar from "./components/pages/admin/AdminCalendar"

// Route Protection
import PrivateRoute from "./components/pages/auth/PrivateRoute"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="availability" element={<Availability />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="checkout/:id" element={<Checkout />} />
        <Route path="contact" element={<Contact />} />
        <Route path="policy" element={<Policy />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />

        {/* Admin (Protected) */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/packages"
          element={
            <PrivateRoute>
              <AdminPackages />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <PrivateRoute>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/calendar"
          element={
            <PrivateRoute>
              <AdminCalendar />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
