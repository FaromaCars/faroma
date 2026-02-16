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
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
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
