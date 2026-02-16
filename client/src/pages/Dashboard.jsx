import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BlogCreation from "../components/BlogCreation";
import ReviewCreation from "../components/ReviewCreation";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [activePage, setActivePage] = useState("cars");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  const [form, setForm] = useState({
    carName: "",
    brand: "",
    year: "",
    price: "",
    kilometer: "",
    vehicleType: "",
    fuelType: "",
    seating: "",
    color: "",
    transmission: "",
    featured: false,
    condition: "New",
    description: "",
  });

  const [images, setImages] = useState([]); // new uploads
  const [backendImages, setBackendImages] = useState([]); // existing images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    brand: "",
    color: "",
    year: "",
    featured: "",
    condition: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Auth check & fetch cars
  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/admin/login", { replace: true });
    } else {
      fetchCars();
    }
  }, [navigate, token]);

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data = await res.json();
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to fetch cars");
    }
  };

  // Filters
  useEffect(() => {
    let temp = [...cars];
    if (filters.brand)
      temp = temp.filter((c) =>
        c.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    if (filters.color)
      temp = temp.filter((c) =>
        c.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    if (filters.year) temp = temp.filter((c) => c.year === Number(filters.year));
    if (filters.featured)
      temp = temp.filter((c) => c.featured === (filters.featured === "true"));
    if (filters.condition)
      temp = temp.filter((c) => c.condition === filters.condition);
    setFilteredCars(temp);
    setCurrentPage(1);
  }, [filters, cars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // File upload & preview
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const MIN_FILE_SIZE = 40 * 1024; // 40 KB
    const MAX_FILE_SIZE = 300 * 1024; // 300 KB

    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (file.size < MIN_FILE_SIZE) {
        toast.warning(`${file.name} is too small. Min 40KB.`);
      } else if (file.size > MAX_FILE_SIZE) {
        toast.warning(`${file.name} is too large. Max 300KB.`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length === 0) return;

    setImages(validFiles);
    setImagePreviews([...backendImages, ...previews]);
  };

  // Set main image
  const handleMainImage = (idx) => {
    if (idx === 0) return;
    const newPreviews = [...imagePreviews];
    [newPreviews[0], newPreviews[idx]] = [newPreviews[idx], newPreviews[0]];
    setImagePreviews(newPreviews);

    if (idx < backendImages.length) {
      const newBackend = [...backendImages];
      [newBackend[0], newBackend[idx]] = [newBackend[idx], newBackend[0]];
      setBackendImages(newBackend);
    } else {
      const newImages = [...images];
      const imgIdx = idx - backendImages.length;
      [newImages[0], newImages[imgIdx]] = [newImages[imgIdx], newImages[0]];
      setImages(newImages);
    }
  };

  // Delete image
  const handleDeleteImage = (idx) => {
    if (idx < backendImages.length) {
      const newBackend = [...backendImages];
      newBackend.splice(idx, 1);
      setBackendImages(newBackend);
    } else {
      const newImages = [...images];
      newImages.splice(idx - backendImages.length, 1);
      setImages(newImages);
    }

    const newPreviews = [...imagePreviews];
    newPreviews.splice(idx, 1);
    setImagePreviews(newPreviews);
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId && images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();

    // New images
    images.forEach((file) => formData.append("images", file));

    // Existing images
    backendImages.forEach((img) => formData.append("existingImages", img));

    // Form fields
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (key === "description") {
        formData.append(key, value || "");
      } else {
        formData.append(key, value ? value.toString().toUpperCase() : "");
      }
    });

    try {
      const url = editId ? `/api/cars/${editId}` : "/api/cars/add";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(editId ? "Failed to update car" : "Failed to add car");
      const data = await res.json();
      toast.success(editId ? "Car updated successfully" : data.message);

      // Reset form
      setForm({
        carName: "",
        brand: "",
        year: "",
        price: "",
        kilometer: "",
        vehicleType: "",
        fuelType: "",
        seating: "",
        color: "",
        transmission: "",
        featured: false,
        condition: "New",
        description: "",
      });
      setImages([]);
      setBackendImages([]);
      setImagePreviews([]);
      setEditId(null);

      fetchCars();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Operation failed");
    }
  };

  // Edit car
  const handleEdit = (car) => {
    setEditId(car._id);
    setForm({
      carName: car.carName,
      brand: car.brand,
      year: car.year,
      price: car.price,
      kilometer: car.kilometer,
      vehicleType: car.vehicleType,
      fuelType: car.fuelType,
      seating: car.seating,
      color: car.color,
      transmission: car.transmission,
      featured: car.featured,
      condition: car.condition || "New",
      description: car.description || "",
    });
    setBackendImages(car.images || []);
    setImagePreviews(car.images || []);
    setImages([]);
  };

  // Delete car
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Car deleted");
      fetchCars();
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Delete failed");
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="lg:w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setActivePage("cars")}
          className={`w-full font-semibold text-left px-4 py-2 rounded ${
            activePage === "cars" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Car Creation
        </button>
        <button
          onClick={() => setActivePage("blogs")}
          className={`w-full font-semibold text-left px-4 py-2 rounded ${
            activePage === "blogs" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          News Creation
        </button>
        <button
          onClick={() => setActivePage("testimonials")}
          className={`w-full font-semibold text-left px-4 py-2 rounded ${
            activePage === "testimonials" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Review Creation
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* ================= CARS PAGE ================= */}
        {activePage === "cars" && (
          <div className="container m-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Car Dashboard</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            {/* Add/Edit Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Car" : "Add New Car"}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Inputs */}
                <input type="text" name="carName" placeholder="Car Name" value={form.carName} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="kilometer" placeholder="Kilometer" value={form.kilometer} onChange={handleChange} className="border p-2 rounded" />

                {/* Selects */}
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="border p-2 rounded">
                  <option value="">Select Vehicle Type</option>
                  <option value="SUV">SUV</option>
                  <option value="SUV/Crossover">SUV/Crossover</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Armored Vehicle">Armored Vehicle</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Sports Car">Sports Car</option>
                  <option value="Ambulance">Ambulance</option>
                </select>
                <select name="fuelType" value={form.fuelType} onChange={handleChange} className="border p-2 rounded">
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                <select name="seating" value={form.seating} onChange={handleChange} className="border p-2 rounded">
                  <option value="">Select Seating</option>
                  <option value="2">2 Seats</option>
                  <option value="3">3 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7 Seats</option>
                </select>
                <input type="text" name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-2 rounded" />
                <select name="transmission" value={form.transmission} onChange={handleChange} className="border p-2 rounded">
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Gear">Gear</option>
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured
                </label>
                <select name="condition" value={form.condition} onChange={handleChange} className="border p-2 rounded">
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded col-span-2" />

                {/* File Upload */}
                <input type="file" multiple onChange={handleFiles} className="col-span-2 border p-2 rounded" />

                {/* Image Previews */}
                <div className="flex gap-2 col-span-2 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt=""
                        className={`w-20 h-16 object-cover rounded border ${idx === 0 ? "border-blue-500 border-2" : "border-gray-300"}`}
                      />
                      {idx === 0 && <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded">Main</span>}
                      {idx !== 0 && <button type="button" onClick={() => handleMainImage(idx)} className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded">Set Main</button>}
                      <button type="button" onClick={() => handleDeleteImage(idx)} className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-1 rounded">Delete</button>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded col-span-2 mt-2">
                  {editId ? "Update Car" : "Add Car"}
                </button>
              </form>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <p>Total Cars: {cars.length}</p>
              <input placeholder="Brand" name="brand" value={filters.brand} onChange={handleFilterChange} className="border p-2 rounded" />
              <input placeholder="Color" name="color" value={filters.color} onChange={handleFilterChange} className="border p-2 rounded" />
              <input placeholder="Year" name="year" value={filters.year} onChange={handleFilterChange} className="border p-2 rounded" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full table-auto ">
                <thead className="bg-gray-200">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCars.map((car) => (
                    <tr key={car._id} className="text-center border-b">
                      <td>{car.images?.[0] && <img src={car.images[0]} className="w-16 h-12 object-cover mx-auto m-3" />}</td>
                      <td>{car.carName}</td>
                      <td>{car.brand}</td>
                      <td>{car.year}</td>
                      <td>{car.price}</td>
                      <td className="">
                        <div className="flex justify-center items-center gap-3">
                        <div className="justify-center items-center">
                          <button onClick={() => handleEdit(car)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Edit</button>
                        </div>
                        <div className="justify-center items-center">
                          <button onClick={() => handleDelete(car._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex gap-2 justify-center my-4">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= BLOGS PAGE ================= */}
        {activePage === "blogs" && <BlogCreation token={token} />}

        {/* ================= TESTIMONIALS PAGE ================= */}
        {activePage === "testimonials" && <ReviewCreation token={token} />}
      </div>
    </div>
  );
}
