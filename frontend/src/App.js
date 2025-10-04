import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AvailabilitySetup from "./pages/AvailabilitySetup";
import BookingsList from "./pages/BookingsList";
import BookingPage from "./pages/BookingPage";
import { ToastContainer } from "react-toastify";

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/availability" element={<AvailabilitySetup/>} />
        <Route path="/bookings" element={<BookingsList/>} />
        <Route path="/book/:userId" element={<BookingPage/>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
