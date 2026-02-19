import { useState } from 'react';
import { BsWhatsapp, BsShare, BsX, BsTelephone } from 'react-icons/bs';
import { IoMdSettings } from "react-icons/io";

function Whatsapp() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleIcons = () => {
        setIsOpen(!isOpen);
    };

    const phoneNumber = '+971565471333';
    const message = 'From Faroma Wesbite Hello!❤️ I would like to enquire about Cars.'; 

    const handleShare = () => {
        if (navigator.share) {
          navigator.share({
            title: "Faroma Motor Trading International LLC",
            text: "Check out this service",
            url: window.location.href, // current page URL
          })
          .catch((error) => console.log('Error sharing:', error));
        } else {
          console.log('Web Share API not supported in this browser.');
          alert("Your browser doesn't support the native sharing feature. You can copy the link manually.");
        }
      };

    return (
        <div className='fixed bottom-14 right-10 lg:bottom-12 lg:right-10 z-50' >
            <div className={`flex flex-col items-center space-y-3  ${isOpen ? 'block' : 'hidden'}`}>
                <div className='bg-green-500 rounded-full p-3 fixed bottom-28 sm:bottom-32'>
                <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                >
                    <BsWhatsapp  className='w-4 h-4 md:w-6 md:h-6 text-white'/>
                </a>
                </div>
                <a href='tel:+971565471333' className='bg-blue-500 rounded-full p-3 fixed right-[5.5rem] bottom-[5.2rem] sm:right-[6rem] sm:bottom-[5.8rem] md:right-[6.5rem]'> 
                    <BsTelephone className='w-4 h-4 md:w-6 md:h-6 text-white'/>
                </a>
                <button onClick={handleShare} className='bg-gray-500 rounded-full p-3 fixed bottom-6 right-[5.5rem] sm:right-[6rem] md:right-[6.7rem]'> 
                    <BsShare className='w-4 h-4 md:w-6 md:h-6 text-white'/>
                </button>
            </div>
            <button 
                onClick={toggleIcons} 
                className={`${isOpen ? "bg-red-600" : "bg-green-600 animate-bounce"} rounded-full p-3 mt-3 `}>
                { isOpen ? <BsX className='w-4 h-4 md:w-6 md:h-6 text-white'/> :
                <IoMdSettings className='w-4 h-4 md:w-6 md:h-6 text-white animate-spin '/>
                }
            </button>
        </div>
    );
}

export default Whatsapp;