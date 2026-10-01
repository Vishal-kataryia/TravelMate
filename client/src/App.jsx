import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import OurWork from './pages/OurWork.jsx';
import Book from './pages/Book.jsx';
import Search from './pages/Search.jsx';
import Matching from './pages/Matching.jsx';
import Booking from './pages/Booking.jsx';
import BookingSuccess from './pages/BookingSuccess.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/book" element={<Book />} />
        <Route path="/search" element={<Search />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/booking/:travelId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/booking-success/:bookingId" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
