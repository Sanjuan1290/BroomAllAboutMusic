import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Layout
import Layout from "./components/pages/layout/Layout";

// Public pages
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Packages from "./components/pages/Packages";
import Recommendation from "./components/pages/Recommendation";
import Availability from "./components/pages/Availability";
import PackageDetails from "./components/pages/PackageDetails";
import Checkout from "./components/pages/Checkout";
import ThankYou from "./components/pages/ThankYou";
import Contact from "./components/pages/Contact";
import Policy from "./components/pages/Policy";
import Page404 from "./components/pages/Page404";

// Auth
import Login from "./components/pages/auth/Login";
import PrivateRoute from "./components/pages/auth/PrivateRoute";

// Admin
import AdminLayout from "./components/pages/admin/AdminLayout";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminPackages from "./components/pages/admin/AdminPackages";
import AdminBookings from "./components/pages/admin/AdminBookings";
import AdminCalendar from "./components/pages/admin/AdminCalendar";
import AdminUpcoming from "./components/pages/admin/AdminUpcoming";
import AdminHistory from "./components/pages/admin/AdminHistory";

// import UploadPackages from "./util/UploadPackages"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="packages" element={<Packages />} />
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="availability" element={<Availability />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="checkout/:id" element={<Checkout />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="contact" element={<Contact />} />
        <Route path="policy" element={<Policy />} />
        {/* <Route path="upload" element={<UploadPackages />} /> */}

        {/* Auth */}
        <Route path="login" element={<Login />} />

        {/* Admin (Protected) */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="upcoming" element={<AdminUpcoming />} />
          <Route path="history" element={<AdminHistory />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
