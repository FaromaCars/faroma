import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ReviewCreation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [reviews, setReviews] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    description: "",
    star: "",
  });

  // AUTH CHECK + FETCH REVIEWS
  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/admin/login");
    } else {
      fetchReviews();
    }
  }, [token, navigate]);

  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/review", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch reviews");
    }
  };

  // HANDLE FORM INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ADD / UPDATE REVIEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.star) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const url = editId ? `/api/review/${editId}` : "/api/review/add";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          star: Number(form.star),
        }),
      });

      if (!res.ok) throw new Error(editId ? "Update failed" : "Add failed");

      toast.success(editId ? "Review updated!" : "Review added!");
      setForm({ name: "", description: "", star: "" });
      setEditId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  // EDIT REVIEW
  const handleEdit = (review) => {
    setEditId(review._id);
    setForm({
      name: review.name,
      description: review.description,
      star: review.star,
    });
  };

  // DELETE REVIEW
  const handleDelete = async (id) => {
    if (!window.confirm("Delete review?")) return;
    try {
      const res = await fetch(`/api/review/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Review deleted!");
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  // PAGINATION
  const last = currentPage * itemsPerPage;
  const first = last - itemsPerPage;
  const currentReviews = Array.isArray(reviews)
    ? reviews.slice(first, last)
    : [];
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Reviews CMS</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Update Review" : "Add Review"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          name="star"
          placeholder="Stars (1-5)"
          value={form.star}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          {editId ? "Update Review" : "Add Review"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Star</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review._id} className="border-b">
                <td>
                  {review.name.slice(0, 40) +
                    (review.name.length > 40 ? "..." : "")}
                </td>
                <td>
                  {review.description.slice(0, 70) +
                    (review.description.length > 70 ? "..." : "")}
                </td>
                <td>
                  {Array.from({ length: 5 }, (_, i) => {
                    if (i + 1 <= Math.floor(review.star)) {
                      // full star
                      return (
                        <FaStar key={i} className="text-yellow-500 inline" />
                      );
                    } else if (i < review.star) {
                      // half star
                      return (
                        <FaStarHalfAlt
                          key={i}
                          className="text-yellow-500 inline"
                        />
                      );
                    } else {
                      // empty star
                      return (
                        <FaRegStar key={i} className="text-gray-300 inline" />
                      );
                    }
                  })}
                </td>

                <td className="space-x-2 py-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
