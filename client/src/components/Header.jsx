import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import logo from "../assets/faromalogo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const menuRef = useRef();
  const [isAdmin, setIsAdmin] = useState(
  !!localStorage.getItem("adminToken"));
  const activeClass = "text-blue-600 font-semibold";
  const normalClass = "text-gray-700 hover:text-blue-600";

  // Load wishlist count
  const loadWishlistCount = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setWishCount(favorites.length);
  };

  useEffect(() => {
    loadWishlistCount();
    window.addEventListener("storage", loadWishlistCount);
    return () => window.removeEventListener("storage", loadWishlistCount);
  }, []);

  useEffect(() => {
  const syncAuth = () => {
    setIsAdmin(!!localStorage.getItem("adminToken"));
  };

  window.addEventListener("authChanged", syncAuth);

  return () => {
    window.removeEventListener("authChanged", syncAuth);
  };
}, []);

  // Close when clicking outside drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="bg-white shadow sticky top-0 z-50 p-2">
      <div className="container mx-auto py-3">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="w-52 lg:w-64" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">
            <NavLink to="/" className={({ isActive }) => isActive ? activeClass : normalClass}>Home</NavLink>
            <NavLink to="/new-cars" className={({ isActive }) => isActive ? activeClass : normalClass}>New Cars</NavLink>
            <NavLink to="/used-cars" className={({ isActive }) => isActive ? activeClass : normalClass}>Used Cars</NavLink>
            <NavLink to="/car-news" className={({ isActive }) => isActive ? activeClass : normalClass}>Car News</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : normalClass}>Contact</NavLink>

            {/* Wishlist Desktop */}
            <NavLink
              to="/wish-list"
              className={({ isActive }) =>
                `${isActive ? activeClass : normalClass} flex items-center gap-2`
              }
            >
              Wishlist
              <span className="bg-red-600 text-white text-sm font-bold flex items-center justify-center w-6 h-6 rounded-full">
                {wishCount}
              </span>
            </NavLink>

            {isAdmin  ? (
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeClass : normalClass}>
                Dashboard
              </NavLink>
            ) : ""}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
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

      {/* Backdrop */}
      {menuOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden"></div>}

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b font-bold text-lg">Menu</div>

        <nav className="flex flex-col">
          <NavLink to="/" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
            Home
          </NavLink>

          <NavLink to="/new-cars" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
            New Cars
          </NavLink>

          <NavLink to="/used-cars" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
            Used Cars
          </NavLink>

          <NavLink to="/car-news" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
            Car News
          </NavLink>

          <NavLink to="/contact" onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
            Contact
          </NavLink>

          {/* Wishlist Mobile */}
          <NavLink
            to="/wish-list"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"}
              px-4 py-3 border-b flex items-center justify-between`
            }
          >
            Wishlist
            <span className="bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {wishCount}
            </span>
          </NavLink>

          {isAdmin  ? (
            <NavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"} px-4 py-3 border-b`}>
              Dashboard
            </NavLink>
          ) : ""}
        </nav>
      </div>
    </header>
  );
}
