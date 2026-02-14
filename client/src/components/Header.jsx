import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../assets/faromalogo.png'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const activeClass = "text-blue-600 font-semibold";
  const normalClass = "text-gray-700 hover:text-blue-600";

  return (
    <header className="bg-white shadow sticky top-0 z-50 p-2">
      <div className="container mx-auto py-3">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="">
            <img src={logo} alt="" className="w-52 lg:w-64"/>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            <NavLink to="/" className={({ isActive }) => isActive ? activeClass : normalClass}>
              Home
            </NavLink>
            <NavLink to="/new-cars" className={({ isActive }) => isActive ? activeClass : normalClass}>
              New Cars
            </NavLink>
            <NavLink to="/used-cars" className={({ isActive }) => isActive ? activeClass : normalClass}>
              Used Cars
            </NavLink>
            <NavLink to="/car-news" className={({ isActive }) => isActive ? activeClass : normalClass}>
              Car News
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : normalClass}>
              Contact
            </NavLink>
            {localStorage.getItem("adminToken") && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeClass : normalClass}>
              Dashboard
            </NavLink>
        )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 border-b hover:bg-gray-100"
          >
            Home
          </NavLink>
          <NavLink
            to="/new-cars"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 border-b hover:bg-gray-100"
          >
            New Cars
          </NavLink>
          <NavLink
            to="/used-cars"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 border-b hover:bg-gray-100"
          >
            Used Cars
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 border-b hover:bg-gray-100"
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Contact
          </NavLink>

          {localStorage.getItem("adminToken") && (
            <NavLink to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
              Dashboard
            </NavLink>
        )}
        
        </nav>
      )}
    </header>
  );
}
