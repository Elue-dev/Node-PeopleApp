import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../src/pages/dashboard/Dashboard";
import Signup from "../src/pages/auth/Signup";
import Login from "../src/pages/auth/Login";
import Navbar from "./components/navbar/Navbar";
import ProtectRoute from "./components/protectRoute/ProtectRoute";
import UpdatePassword from "./pages/auth/UpdatePassword";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
