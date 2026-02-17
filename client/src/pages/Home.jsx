import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/Faroma Home.mp4";
import about1 from "../assets/about1.jpg";
import { FaCar } from "react-icons/fa";
import { IoIosPricetag } from "react-icons/io";
import { TiSpanner } from "react-icons/ti";
import { AiOutlineThunderbolt } from "react-icons/ai";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Brands } from "../api/brands";
import HomeReview from "../components/HomeReview";
import Preloader from "../components/Preloader";
import {Vehicles} from '../api/vehicles'
import Feedback from "../components/Feedback";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start loading

        // Fetch featured cars
        const carsRes = await fetch("/api/cars?featured=true");
        const carsData = await carsRes.json();
        setCars(carsData);

        // Fetch latest 4 blogs
        const newsRes = await fetch(`/api/blogs`);
        const newsData = await newsRes.json();
        const shuffledNews = [...newsData] 
          .sort(() => Math.random() - 0.5) // shuffle randomly
          .slice(0, 4); // take first 4 items

        setNews(shuffledNews);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchData();
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="absolute w-full h-full object-cover pointer-events-none"
          src={heroVideo}
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find Your Dream Car
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-6">
            Explore the best cars available in the UAE with great deals
          </p>

          <div className="flex gap-5">
            <Link
              to="/new-cars"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Browse New Cars
            </Link>
            <Link
              to="/used-cars"
              className="bg-white hover:bg-gray-300 text-black font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Browse Used Cars
            </Link>
          </div>
        </div>
      </div>
      {/* Hero Section Ends*/}

      {/* Why Choose Us */}
      <div id="" className="p-8 mx-auto bg-gray-100 py-8">
        <h2 className="text-2xl md:text-4xl text-gray-700 font-semibold mb-2 text-center">
          Why Choose FAROMA Motor?
        </h2>
        <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>

        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 m-auto">
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
                Our team helps you choose the right car and guides you through
                the whole process.
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
      </div>
      {/* Why Choose Us Ends*/}

      {/* Cars Section */}
      <div id="cars" className="p-6 container mx-auto mt-6">
        <h2 className="text-2xl md:text-4xl text-gray-700 font-semibold mb-2 text-center">
          Featured Cars
        </h2>
        <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>

        {cars.length === 0 ? (
          <p className="text-center text-gray-500">No cars available.</p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            navigation
            speed={2000}
            loop={true}
            allowTouchMove={true}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="carSwiper"
          >
            {cars.map((car) => (
              <SwiperSlide key={car._id}>
                <Link
                  to={`/cars/${car._id}`}
                  className="border p-4 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white block"
                >
                  <img
                    src={car.images?.[0] || "/placeholder.png"}
                    alt={`${car.brand} ${car.model}`}
                    className="rounded-lg mb-3 w-full h-48 object-cover"
                  />
                  <h3 className="text-xl font-semibold">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600">Year: {car.year}</p>
                  <p className="text-gray-600">Color: {car.color}</p>
                  <p className="font-bold text-lg mt-2 text-blue-600">
                    AED {car.price}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      {/* Cars Section Ends */}

      {/* Car Types */}
      <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-center text-gray-700">
                We Provide All Type of Vehicles
              </h2>
              
              <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                navigation
                speed={4000}
                loop={true}
                allowTouchMove={true}
                autoplay={{ delay: false, disableOnInteraction: false }}
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

      {/* Car Types End */}

      {/* Services */}
      <div id="" className="p-8 mx-auto py-8 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 m-auto items-center">
          <div>
            <img src={about1} alt="" className="rounded-xl w-auto h-auto" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-gray-700">
              We Provide Our Services
            </h2>
            <p className="text-gray-600 text-lg">
              At Faroma Motor Trading International LLC, we offer premium
              vehicle trading services to customers worldwide. Whether you are
              looking for brand-new models or carefully inspected used cars, we
              ensure high-quality vehicles at trusted and affordable prices.
              With our extensive network of reliable partners, we make it easy
              to deliver your chosen car directly to your location, wherever you
              are. Our commitment is to provide a smooth, transparent, and
              efficient process for all your vehicle needs, across Europe, Asia,
              the Americas, and beyond.
            </p>
            <div className="mt-6">
              <Link
                to="/about-us"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 mt-4"
              >
                Explore More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Services Ends*/}

      {/* Brands */}
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
      {/* Brands Ends*/}

      <div className="container mx-auto p-5">
        <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-center text-gray-700">
          Faroma Car News
        </h2>
        <span className="block w-40 h-1 bg-gray-700 mx-auto rounded mb-6"></span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {news.map((blog) => (
            <div
              key={blog._id}
              className=" bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
            >
              {/* IMAGE */}
              <Link to={`/car-news/${blog._id}`} className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {blog.title}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                    {blog.description}
                  </p>
                </div>

                {/* BUTTON */}
                <Link
                  to={`/car-news`}
                  className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                >
                  View News
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HomeReview />
      <Feedback />
    </div>
  );
}
