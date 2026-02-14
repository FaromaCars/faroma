import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Preloader from "../components/Preloader";

export default function UsedCars() {
  const carsPerPage = 20;

  // State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(500000);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    vehicleType: "",
    fuelType: "",
    transmission: "",
    seating: "",
    color: "",
    sort: "",
  });

  // Fetch cars on mount
  useEffect(() => {
  const fetchCars = async () => {
    try {
      setLoading(true);

      // Fetch new cars
      const res = await fetch("/api/cars?condition=USED");
      const data = await res.json();
      setCars(data);

      // Preload first-page images
      const firstImages = data.slice(0, carsPerPage)
        .map(car => car.images?.[0])
        .filter(Boolean);

      await Promise.all(firstImages.map(src => new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      })));

    } catch (err) {
      console.error("Failed to fetch cars:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCars();
}, []); // ✅ Runs only once on mount



  // Reset page when filters or priceRange change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, priceRange]);

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "brand") setFilters({ ...filters, brand: value});
    else setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      brand: "",
      vehicleType: "",
      fuelType: "",
      transmission: "",
      seating: "",
      color: "",
      sort: "",
    });
    setPriceRange(500000);
  };

  // Unique options
  const uniqueOptions = (key) => [...new Set(cars.map(car => car[key]).filter(Boolean))];
  const brands = uniqueOptions("brand");
  const vehicleTypes = uniqueOptions("vehicleType");
  const fuelTypes = uniqueOptions("fuelType");
  const transmissions = uniqueOptions("transmission");
  const seatings = uniqueOptions("seating");
  const colors = uniqueOptions("color");

  // Filter + Sort
  const filteredCars = useMemo(() => {
    let filtered = cars.filter(car =>
      `${car.brand} ${car.carName || ""}`.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (filters.brand) filtered = filtered.filter(c => c.brand === filters.brand);
    if (filters.vehicleType) filtered = filtered.filter(c => c.vehicleType === filters.vehicleType);
    if (filters.fuelType) filtered = filtered.filter(c => c.fuelType === filters.fuelType);
    if (filters.transmission) filtered = filtered.filter(c => c.transmission === filters.transmission);
    if (filters.seating) filtered = filtered.filter(c => c.seating == filters.seating);
    if (filters.color) filtered = filtered.filter(c => c.color === filters.color);

    filtered = filtered.filter(c => c.price <= priceRange);

    if (filters.sort === "newest") filtered.sort((a,b)=> b.year - a.year);
    if (filters.sort === "oldest") filtered.sort((a,b)=> a.year - b.year);
    if (filters.sort === "priceLow") filtered.sort((a,b)=> a.price - b.price);
    if (filters.sort === "priceHigh") filtered.sort((a,b)=> b.price - a.price);

    return filtered;
  }, [cars, filters, priceRange]);

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Used Cars</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="bg-white p-5 rounded-2xl shadow space-y-4 h-fit lg:sticky top-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={resetFilters} className="text-sm text-red-500">Reset</button>
            </div>

            <input
              type="text"
              name="search"
              placeholder="Search car..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded"
            />

            <div>
              <label className="text-sm font-medium">Max Price: <b>AED {priceRange}</b></label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={priceRange}
                onChange={(e)=>setPriceRange(e.target.value)}
                className="w-full"
              />
            </div>

            <Select name="brand" value={filters.brand} options={brands} onChange={handleFilterChange} label="Brand"/>
            <Select name="vehicleType" value={filters.vehicleType} options={vehicleTypes} onChange={handleFilterChange} label="Vehicle Type"/>
            <Select name="fuelType" value={filters.fuelType} options={fuelTypes} onChange={handleFilterChange} label="Fuel Type"/>
            <Select name="transmission" value={filters.transmission} options={transmissions} onChange={handleFilterChange} label="Transmission"/>
            <Select name="seating" value={filters.seating} options={seatings} onChange={handleFilterChange} label="Seating"/>
            <Select name="color" value={filters.color} options={colors} onChange={handleFilterChange} label="Color"/>
          </div>

          {/* Car Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Preloader />
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-4">
                  <p>{filteredCars.length} Cars Found</p>
                  <select name="sort" value={filters.sort} onChange={handleFilterChange} className="border p-2 rounded">
                    <option value="">Sort By</option>
                    <option value="newest">Newest Year</option>
                    <option value="oldest">Oldest Year</option>
                    <option value="priceLow">Price Low → High</option>
                    <option value="priceHigh">Price High → Low</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCars.map(car => (
                    <Link key={car._id} to={`/cars/${car._id}`} className="border p-4 rounded-xl shadow hover:shadow-xl bg-white">
                      <img src={car.images?.[0] || "/placeholder.png"} className="h-48 w-full object-cover rounded"/>
                      <h2 className="text-xl font-semibold mt-2">{car.brand} {car.carName}</h2>
                      <p>Year: {car.year}</p>
                      <p>Fuel: {car.fuelType}</p>
                      <p>KM: {car.kilometer}</p>
                      {car.price ? <p className="font-bold text-blue-600">AED {car.price.toLocaleString()}</p> : <p className="font-bold text-red-600">Sold Out</p>}
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2 flex-wrap">
                    <button onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1} className="px-4 py-2 border rounded">Prev</button>
                    {[...Array(totalPages)].map((_,i)=>(
                      <button
                        key={i}
                        onClick={()=>setCurrentPage(i+1)}
                        className={`px-4 py-2 border rounded ${currentPage===i+1 ? "bg-blue-600 text-white":""}`}
                      >
                        {i+1}
                      </button>
                    ))}
                    <button onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages} className="px-4 py-2 border rounded">Next</button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple Select Component
function Select({ name, value, options, onChange, label }) {
  return (
    <select name={name} value={value} onChange={onChange} className="w-full border p-2 rounded">
      <option value="">{label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
