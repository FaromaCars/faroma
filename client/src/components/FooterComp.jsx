import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitterX } from "react-icons/bs";
import logowhite from "../assets/faromalogo white.png";

export default function FooterCom() {
  return (
    <footer className="bg-gray-800 border-t-8 border-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="md:flex md:justify-between md:gap-8">
          {/* Logo & Description */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Link to="/">
              <img src={logowhite} alt="Faroma Cars Logo" className="w-72 mb-3" />
            </Link>
            <p className="text-sm md:text-base">
              Welcome to FAROMA Motor Trading International LLC FZ, a trusted leader in the international import and export of all types of vehicles, with more than 25 years of experience in the automotive trade industry, we specialize in connecting buyers and sellers worldwide, offering an extensive selection of new, used, luxury, and specialty vehicles at competitive prices.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:w-2/3">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/new-cars" className="hover:text-gray-300">New Cars</Link>
                </li>
                <li>
                  <Link to="/used-cars" className="hover:text-gray-300">Used Cars</Link>
                </li>
                <li>
                  <Link to="/about-us" className="hover:text-gray-300">About Us</Link>
                </li>
                <li>
                  <Link to="/car-news" className="hover:text-gray-300">Car News</Link>
                </li>
                <li>
                  <Link to="/contact-us" className="hover:text-gray-300">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-bold mb-2">Follow Us</h3>
              <ul className="space-y-1">
                <li>
                  <a href="https://www.facebook.com/people/Faroma/61555613488967/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500">Facebook</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/faroma_mti/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">Instagram</a>
                </li>
                <li>
                  <a href="https://x.com/FAROMAMTI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">Twitter X</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-2">Get in Touch</h3>
              <ul className="space-y-1">
                <li>
                  <a href="tel:971565471333" className="hover:text-gray-300">+971 56 547 1333</a>
                </li>
                <li>
                  <a href="mail:info@faromamti.com" className="hover:text-gray-300"> info@faromamti.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white mt-6"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
          <p className="text-sm">&copy; 2026 Faroma Cars. All Rights Reserved.</p>
          <p className="text-sm">
            Designed By{" "}
            <a href="https://bright-uae.com" target="_blank" className="text-white font-semibold hover:underline">Bright Solution Computer</a>
          </p>
          <div className="flex gap-4 text-xl">
            <a href="https://www.facebook.com/people/Faroma/61555613488967/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500">
              <BsFacebook />
            </a>
            <a href="https://x.com/FAROMAMTI" target="_blank" rel="noopener noreferrer" className="hover:text-black">
              <BsTwitterX />
            </a>
            <a href="https://www.instagram.com/faroma_mti/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">
              <BsInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
