import React, { useEffect, useState } from "react";
import { BsQuote } from "react-icons/bs";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

const HomeReview = () => {
  const [review, setReview] = useState([]);

  // 🌈 Gradient colors for each card
  const gradients = [
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
    "from-teal-500 to-lime-600",
  ];

  const avatarColors = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
    "bg-teal-100 text-teal-700",
  ];

  // ⭐ Half star render function
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 my-2 ps-2">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return <FaStar key={star} className="text-yellow-400" />;
          } else if (rating >= star - 0.5) {
            return <FaStarHalfAlt key={star} className="text-yellow-400" />;
          } else {
            return <FaRegStar key={star} className="text-gray-300" />;
          }
        })}
        <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
      </div>
    );
  };

  // fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("/api/review");
      const data = await res.json();
      setReview(data.data || []);
    };
    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-center text-gray-700 mt-10">
        Client Feedback
      </h2>
      <span className="block w-40 h-1 bg-gray-600 mx-auto rounded mb-10"></span>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        navigation
        speed={2000}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="carSwiper"
      >
        {review.map((item, index) => (
          <SwiperSlide key={item._id} className="p-4">
            <div className="bg-white shadow-xl transition duration-300 rounded-2xl p-6 h-full flex flex-col justify-between">
              {/* 🌈 Dynamic Quote icon */}
              <div
                className={`bg-gradient-to-r ${
                  gradients[index % gradients.length]
                } w-16 h-16 flex items-center justify-center rounded-full shadow-md`}
              >
                <BsQuote className="text-white text-4xl" />
              </div>

              {/* User */}
              <div className="flex items-center gap-3 mt-4">
                <div
                  className={`w-12 h-12 rounded-full ${
                    avatarColors[index % avatarColors.length]
                  } flex items-center justify-center font-bold text-lg`}
                >
                  {item.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-lg font-semibold">
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">Google Review</p>
                </div>
              </div>

              {/* Review */}
              <p className="text-gray-600 mt-4 leading-relaxed text-sm ps-2">
                "{item.description}"
              </p>

              {/* Stars */}
              {renderStars(item.star)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeReview;
