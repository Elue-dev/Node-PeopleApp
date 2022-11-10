import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../src/pages/dashboard/Dashboard";
import Signup from "../src/pages/auth/Signup";
import Login from "../src/pages/auth/Login";
import Navbar from "./components/navbar/Navbar";
import ProtectRoute from "./components/protectRoute/ProtectRoute";
import UpdatePassword from "./pages/auth/UpdatePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectAuth from "./components/protectRoute/ProtectAuth";
import VerifyEmail from "./pages/auth/VerifyEmail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
        <Route path="/reset-password/:token/:id" element={<ResetPassword />} />
        <Route
          path="/signup"
          element={
            <ProtectAuth>
              <Signup />
            </ProtectAuth>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectAuth>
              <Login />{" "}
            </ProtectAuth>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectAuth>
              <ForgotPassword />
            </ProtectAuth>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
