import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Preloader from "../components/Preloader"; // ✅ Import your preloader

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [relatedCars, setRelatedCars] = useState([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true); // show loader
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();

        setCar(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }

        // Fetch related cars
        const relatedRes = await fetch(`/api/cars?brand=${data.brand}&limit=6`);
        const relatedData = await relatedRes.json();
        setRelatedCars(relatedData.filter((c) => c._id !== id));

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // hide loader
      }
    };

    fetchCar();
  }, [id]);

  // ------------------ Preloader while loading ------------------
  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Preloader />
    </div>
  );

  if (!car) return <p className="text-center mt-20">Car not found</p>;

  // ------------------ Enquiry message ------------------
  const enquiryMessage = `
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
  `;

  const handleEmailEnquiry = () => {
    const subject = encodeURIComponent(`Car Enquiry - ${car.carName}`);
    const body = encodeURIComponent(enquiryMessage);
    window.location.href = `mailto:sales@faromacars.com?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = "971502020786"; // 🔴 Your number
    const message = encodeURIComponent(enquiryMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // ------------------ Render Car Details ------------------
  return (
    <div className="p-4 md:p-8 container mx-auto space-y-8">

      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        {car.condition === "NEW" ? (
          <Link to="/new-cars" className="hover:underline">Cars</Link>
        ) : (
          <Link to="/used-cars" className="hover:underline">Cars</Link>
        )}
        {" / "}
        <span className="text-gray-700">{car.carName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Images */}
        <div className="lg:w-1/2 space-y-3">
          <img
            src={mainImage}
            alt={car.carName}
            className="w-full h-auto lg:h-96 object-cover rounded shadow"
          />
          {car.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-2 pb-2">
              {car.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    img === mainImage ? "border-blue-600" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:w-1/2 bg-white p-6 rounded shadow space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{car.carName}</h1>
              <span className="bg-gray-200 px-3 py-1 rounded text-sm">{car.condition}</span>
            </div>
            {car.price ? (
              <p className="text-4xl text-blue-600 font-bold mt-3">AED {car.price.toLocaleString()}</p>
            ) : (
              <p className="text-4xl text-red-600 font-bold mt-3">Sold Out</p>
            )}
            <p className="text-gray-700 mt-3">{car.description}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4">
            <Spec title="Brand" value={car.brand}/>
            <Spec title="Year" value={car.year}/>
            <Spec title="Mileage" value={`${car.kilometer} km`}/>
            <Spec title="Fuel" value={car.fuelType}/>
            <Spec title="Type" value={car.vehicleType}/>
            <Spec title="Transmission" value={car.transmission}/>
            <Spec title="Seating" value={car.seating}/>
            <Spec title="Color" value={car.color}/>
          </div>

          {/* Buttons */}
          <button onClick={handleEmailEnquiry} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full">
            Enquire via Email
          </button>
          <button onClick={handleWhatsAppEnquiry} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full">
            Enquire via WhatsApp
          </button>
        </div>
      </div>

      {/* Related Cars */}
      {relatedCars.length ? (
        <div>
          <h2 className="text-3xl font-bold mb-4">Related Brands</h2>
          <div className="flex gap-4 overflow-x-auto">
            {relatedCars.map((r) => (
              <Link key={r._id} to={`/cars/${r._id}`} className="min-w-[200px] bg-white rounded-lg shadow-md border">
                <img src={r.images[0]} className="w-full h-40 object-cover"/>
                <div className="p-3">
                  <h3>{r.carName}</h3>
                  <p className="text-blue-600 font-bold">AED {r.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : <p>No Related Brands Available</p>}
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
