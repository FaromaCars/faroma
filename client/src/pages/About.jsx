import React from "react";
import { Link } from "react-router-dom";
import about2 from "../assets/about2.png";
import about3 from "../assets/about3.png";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { TiSpanner } from "react-icons/ti";
import { IoIosPricetag } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {Vehicles} from '../api/vehicles'
import { Brands } from "../api/brands";
import Feedback from "../components/Feedback";

export default function AboutUs() {
  return (
    <div className="bg-white">
      <div className="my-2 md:my-2 font-semibold text-center py-4 flex flex-col gap-3  p-4">
        <h1 className="text-2xl md:text-5xl text-black text-center">
          About Our{" "}
          <span className="text-gray-700 border-b-4 border-gray-700 ">
            Company
          </span>
        </h1>
      </div>

      {/* SECTION 1 */}
      <section className="bg-white py-1 lg:py-8 px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-center mt-0 lg:mt-4">
        <div className="lg:w-1/2 mb-2 lg:mb-0 order-2 lg:order-1 mx-5 md:mx-16 lg:mx-3">
          <h1 className="text-xl md:text-2xl 2xl:text-4xl font-semibold mb-6 text-black">
            Faroma Motor{" "}
            <span className="text-gray-700 ">Trading International LLC</span>
          </h1>

          <ul className="text-gray-700 space-y-4 text-sm lg:text-base 2xl:text-2xl">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Global sourcing of brand-new and pre-owned vehicles from UAE stock
              and international auctions.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Dedicated support for car dealers, resellers, and individual
              buyers worldwide.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Access to competitive pricing and exclusive dealer packages.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Complete export handling including documentation and logistics.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Strong partnerships with trusted shipping and logistics providers.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Transparent, reliable and customer-focused vehicle import process.
            </li>
          </ul>
        </div>

        <div className="lg:w-1/2 lg:ml-12 order-1 lg:order-2 my-5">
          <img className="" src={about2} alt="Faroma Motors" />
        </div>
      </section>

        <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-center text-gray-700">
          Type of Vehicles We Provide
        </h2>

        <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          navigation
          speed={4000}
          loop={true}
          allowTouchMove={true}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="carSwiper container"
        >
          {Vehicles.map((vehicle) => (
            <SwiperSlide key={vehicle._id}>
              <div className="p-4 rounded-xl transition duration-300 bg-white block">
                <img
                  src={vehicle.image || "/placeholder.png"}
                  className="rounded-lg w-auto "
                />
                <p className="text-center font-semibold text-xl">{vehicle.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      {/* SECTION 2 */}
      <section className="py-3 lg:py-12 px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-center mt-4 ">
        <div className="lg:w-1/2 lg:mr-12 order-2 lg:order-1 my-5">
          <img
            className="md:w-[600px] md:h-[300px] xl:w-[2500px] xl:h-auto"
            src={about3}
            alt="Vehicle Export"
          />
        </div>

        <div className="lg:w-1/2 mb-2 lg:mb-0 order-2 lg:order-1 mx-5 md:mx-16 lg:mx-3">
          <h1 className="text-xl md:text-2xl 2xl:text-4xl font-semibold mb-6 text-black">
            Global{" "}
            <span className="text-gray-700">Vehicle Export Solutions</span>
          </h1>

          <ul className="text-gray-700 space-y-4 text-sm lg:text-base 2xl:text-2xl">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Simplifying international car importing with a smooth and
              hassle-free process.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Access to thousands of vehicles from UAE showrooms and global
              auctions.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              End-to-end service from vehicle selection to shipping and
              delivery.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Assistance with customs clearance and international documentation.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span>
              Helping automotive businesses grow with long-term partnerships.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 m-auto my-4 p-4">
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white">
          <div className="">
            <FaCar className="w-10 h-10 text-gray-700" />
            <h3 className="text-2xl font-bold py-2 text-gray-700">
              Quality Cars
            </h3>
            <p className="text-gray-600 font-medium">
              We offer a wide range of new and used cars that are checked for
              safety and performance.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white">
          <div className="">
            <IoIosPricetag className="w-10 h-10 text-gray-700" />
            <h3 className="text-2xl font-bold py-2 text-gray-700">
              Honest Prices
            </h3>
            <p className="text-gray-600 font-medium">
              No hidden fees. Clear pricing so you know exactly what you pay.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white">
          <div className="">
            <TiSpanner className="w-10 h-10 text-gray-700" />
            <h3 className="text-2xl font-bold py-2 text-gray-700">
              Friendly Support
            </h3>
            <p className="text-gray-600 font-medium">
              Our team helps you choose the right car and guides you through the
              whole process.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white">
          <div className="">
            <AiOutlineThunderbolt className="w-10 h-10 text-gray-700" />
            <h3 className="text-2xl font-bold py-2 text-gray-700">
              Easy & Fast Process
            </h3>
            <p className="text-gray-600 font-medium">
              Quick paperwork and simple steps to get your car without stress.
            </p>
          </div>
        </div>
      </div>

      <div id="cars" className="p-6 container mx-auto mt-6">
        <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-center text-gray-700">
          Popular Car Brands in UAE
        </h2>
        <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          navigation
          speed={3000}
          loop={true}
          allowTouchMove={true}
          autoplay={{ delay: false, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="carSwiper"
        >
          {Brands.map((brand) => (
            <SwiperSlide key={brand._id}>
              <div className="p-4 rounded-xl transition duration-300 bg-white block">
                <img
                  src={brand.image || "/placeholder.png"}
                  className="rounded-lg w-auto "
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <Feedback />
    </div>
  );
}
