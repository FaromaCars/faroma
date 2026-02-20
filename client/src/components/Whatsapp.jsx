import { useState } from "react";
import { BsWhatsapp, BsShare, BsX, BsTelephone } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";

function Whatsapp() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "+971565471333";
  const message =
    "From Faroma Wesbite Hello!❤️ I would like to enquire about Cars.";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Faroma Motor Trading International LLC",
        text: "Check out this service",
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported. Please copy link manually.");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end gap-3">

      {/* Floating Icons */}
      <div
        className={`flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 p-3 md:p-4 rounded-full shadow-lg transition"
        >
          <BsWhatsapp className="text-white w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
        </a>

        {/* Call */}
        <a
          href="tel:+971565471333"
          className="bg-blue-500 hover:bg-blue-600 p-3 md:p-4 rounded-full shadow-lg transition"
        >
          <BsTelephone className="text-white w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
        </a>

        {/* Share */}
        <button
          onClick={handleShare}
          className="bg-gray-500 hover:bg-gray-600 p-3 md:p-4 rounded-full shadow-lg transition"
        >
          <BsShare className="text-white w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
        </button>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "bg-red-600 " : "bg-green-600 animate-bounce"
        } p-3 md:p-5 rounded-full  transition-all duration-300`}
      >
        {isOpen ? (
          <BsX className="text-white w-5 h-5 md:w-5 md:h-6" />
        ) : (
          <IoMdSettings className="text-white w-5 h-5 md:w-6 md:h-6 animate-spin" />
        )}
      </button>
    </div>
  );
}

export default Whatsapp;
