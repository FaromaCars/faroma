import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import NewCars from "./pages/NewCars";
import UsedCars from "./pages/UsedCars";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import FooterCom from "./components/FooterComp";
import CarNews from "./pages/CarNews";
import CarNewsDetails from "./pages/CarNewsDetails";
import ScrollToTop from "./components/ScrollToTop";
import HeaderMarquee from "./components/HeaderMarquee";
import About from "./pages/About";
import Wishlist from "./components/Wishlist";
import Whatsapp from "./components/Whatsapp";
import Missing from "./components/Missing";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />
        <HeaderMarquee />
        <Header />
        <Whatsapp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Missing />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wish-list" element={<Wishlist />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/new-cars" element={<NewCars />} />
        <Route path="/used-cars" element={<UsedCars />} />
        <Route path="/car-news" element={<CarNews />} />
        <Route path="/car-news/:id" element={<CarNewsDetails />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
