import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Preloader from "../components/Preloader";
import { BsHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Feedback from "../components/Feedback";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [relatedCars, setRelatedCars] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // -------- Email Modal State --------
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();
        setCar(data);
        if (data.images && data.images.length > 0) setMainImage(data.images[0]);

        // Fetch related cars
        const relatedRes = await fetch(`/api/cars?brand=${data.brand}&limit=6`);
        const relatedData = await relatedRes.json();
        setRelatedCars(relatedData.filter((c) => c._id !== id));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.find((item) => item._id === id) ? true : false);
  }, [id]);

  const toggleFunction = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const updated = favorites.filter((item) => item._id !== car._id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
      toast.success("Removed from Wishlist", { theme: "colored" });
    } else {
      favorites.push(car);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success("Added to Wishlist", { theme: "colored" });
    }
    window.dispatchEvent(new Event("storage"));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Preloader />
      </div>
    );

  if (!car) return <p className="text-center mt-20">Car not found</p>;

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(`
Car Enquiry 🚗

Car: ${car.carName}
Price: AED ${car.price}
Condition: ${car.condition}
Brand: ${car.brand}
Year: ${car.year}
Mileage: ${car.kilometer} km
Fuel: ${car.fuelType}
Transmission: ${car.transmission}
Seating: ${car.seating}
Color: ${car.color}
Link: ${window.location.href}
    `);
    window.open(`https://wa.me/+971565471333?text=${message}`, "_blank");
  };

  // -------- Submit Email Enquiry --------
  const handleEmailSubmit = async () => {
    if (!userName || !userEmail || !userPhone) {
      toast.error("Please fill all fields", { theme: "colored" });
      return;
    }

    try {
      const res = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone,
          enquiryType: "Car Enquiry",
          carName: car.carName,
          brand: car.brand,
          condition: car.condition,
          price: car.price,
          year: car.year,
          kilometer: car.kilometer,
          fuelType: car.fuelType,
          transmission: car.transmission,
          seating: car.seating,
          color: car.color,
          link: window.location.href,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Enquiry sent successfully", { theme: "colored" });
        setShowEmailModal(false);
        setUserName("");
        setUserEmail("");
        setUserPhone("");
      } else {
        toast.error(data.message || "Failed to send email", { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", { theme: "colored" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-4 md:p-8 container mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-gray-500 text-sm my-3">
          <Link to="/" className="hover:underline">Home</Link> /{" "}
          <Link to={car.condition === "NEW" ? "/new-cars" : "/used-cars"} className="hover:underline">Cars</Link> /{" "}
          <span className="text-gray-700">{car.carName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Images */}
          <div className="lg:w-1/2 space-y-3 lg:sticky lg:top-32 self-start relative">
            <img src={mainImage} alt={car.carName} className="w-full h-auto lg:h-96 object-full rounded shadow " />
            <div
              onClick={toggleFunction}
              className={`${isFavorite ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-xs md:text-sm flex items-center justify-center font-semibold gap-2 cursor-pointer text-white rounded-full py-3 w-32 sm:w-40 absolute top-0 left-2`}
            >
              <p>{isFavorite ? "Remove Wishlist" : "Add Wishlist"}</p>
              <BsHeartFill />
            </div>

            {car.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto mt-2 pb-2">
                {car.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${img === mainImage ? "border-blue-600" : "border-gray-300"}`}
                    onClick={() => setMainImage(img)}
                    onMouseEnter={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 bg-white p-6 rounded shadow space-y-6">
            <div>
              <div className="flex justify-start items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold">{car.brand} {car.carName}</h1>
                <span className="bg-gray-200 px-3 py-1 rounded text-sm">{car.condition}</span>
              </div>
              {car.price ? (
                <p className="text-3xl md:text-4xl text-blue-600 font-bold mt-3">AED {car.price.toLocaleString()}</p>
              ) : (
                <p className="text-3xl md:text-4xl text-red-600 font-bold mt-3">Sold Out</p>
              )}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2">
              <Spec title="Brand" value={car.brand} />
              <Spec title="Year" value={car.year} />
              <Spec title="Mileage" value={`${car.kilometer ? `${car.kilometer} km` : "0"}`} />
              <Spec title="Fuel" value={car.fuelType} />
              <Spec title="Type" value={car.vehicleType} />
              <Spec title="Transmission" value={car.transmission} />
              <Spec title="Seating" value={car.seating} />
              <Spec title="Color" value={car.color} />
              <p className="text-gray-700 mt-3">{car.description}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col lg:flex-row gap-6">
              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-gray-700 text-white px-6 py-3 font-semibold rounded hover:bg-gray-800 w-full"
              >
                Enquire via Email
              </button>
              <button
                onClick={handleWhatsAppEnquiry}
                className="bg-green-600 text-white px-6 py-3 font-semibold rounded hover:bg-green-700 w-full"
              >
                Enquire via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length ? (
          <div>
            <h2 className="text-3xl font-bold mb-4 mt-4">Related Brands</h2>
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
                1024: { slidesPerView: 3 },
                1240: { slidesPerView: 4 },
              }}
              className="carSwiper"
            >
              {relatedCars.map((r) => (
                <SwiperSlide key={r._id}>
                  <Link to={`/cars/${r._id}`} className="rounded-xl shadow-2xl">
                    <img src={r.images[0]} className="w-full h-52 object-fill" />
                    <div className="p-3">
                      <h3>{r.carName}</h3>
                      <p className="text-blue-600 font-bold">AED {r.price}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p>No Related Brands Available</p>
        )}
      </div>

      <Feedback />

      {/* -------- Email Modal -------- */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 space-y-4 relative">
            <h2 className="text-xl font-bold text-center">Enquire via Email for {car.brand} {car.carName}</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Phone Number"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none"
            />

            <button
              onClick={handleEmailSubmit}
              className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800"
            >
              Send Enquiry
            </button>

            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Small reusable spec component
function Spec({ title, value }) {
  return (
    <div className="bg-gray-100 p-3 rounded text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}