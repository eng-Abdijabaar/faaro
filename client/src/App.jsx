import { BrowserRouter, Routes, Route } from "react-router";

import AuthInitializer from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Public pages
import Home from "./pages/home";
import Explore from "./pages/Explore";
import UnitDetails from "./pages/UnitDetails";
import About from "./pages/About";

// Authentication pages
import SignIn from "./pages/SignIn";
import Signup from "./pages/signup";

// Customer pages
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseCancel from "./pages/PurchaseCancel";
import RequestRefund from "./pages/RequestRefund";
import RefundDetails from "./pages/RefundDetails";
import CustomerRefunds from "./pages/CustomerRefunds";

// Admin pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Users from "./pages/dashboard/Users";
import Businesses from "./pages/dashboard/Businesses";
import AdminBookings from "./pages/dashboard/Bookings";
import Refunds from "./pages/dashboard/Refunds";


// Business owner pages
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessUnits from "./pages/business/Units";
import BusinessBookings from "./pages/business/Bookings";
import CheckBooking from "./pages/business/CheckBooking";
import BusinessProfile from "./pages/business/Profile";
import ForggetPassword from "./pages/ForggetPassword";
import ResetPassword from "./pages/ResetPassword";
import VeryfyEmail from "./pages/VeryfyEmail";
import CustomerProfile from "./pages/Profile";


const App = () => {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/unit/:id" element={<UnitDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify-email" element={<VeryfyEmail />} />

          <Route path="/verify-email/:token" element={<VeryfyEmail />} />

          {/* Authentication pages */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/forgot-password" element={<ForggetPassword />} />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
          </Route>

          {/* Customer pages */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />} >
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/bookings/:id/refund" element={<RequestRefund />} />
            <Route path="/refunds" element={<CustomerRefunds />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/refunds/:id" element={<RefundDetails />} />
            <Route path="/purchase/success" element={<PurchaseSuccess />} />
            <Route path="/purchase/cancel" element={<PurchaseCancel />} />
          </Route>

          {/* Admin pages */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />} >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/businesses" element={<Businesses />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/refunds" element={<Refunds />} />
          </Route>

          {/* Business owner pages */}
          <Route element={<ProtectedRoute allowedRoles={["owner"]} />} >
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/units" element={<BusinessUnits />} />
            <Route path="/business/bookings" element={<BusinessBookings />} />
            <Route path="/business/check-booking" element={<CheckBooking />} />
            <Route path="/business/profile" element={<BusinessProfile />} />
          </Route>
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default App;