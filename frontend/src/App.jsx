import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import StolenCars from "./pages/StolenCars";
import PublicDriverProfile from './pages/PublicDriverProfile';
import { AuthProvider } from "./AuthContext";

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans selection:bg-[var(--primary)] selection:text-black">
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/stolen-cars" element={<StolenCars />} />
            <Route path="/verify-driver/:id" element={<PublicDriverProfile />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
