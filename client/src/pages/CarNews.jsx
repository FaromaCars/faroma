import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Preloader from "../components/Preloader";

// Simple preloader component


export default function CarNews() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [sort, setSort] = useState("latest"); // latest / oldest
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchBlogs = async () => {
    try {
      setLoading(true); // show preloader
      const res = await fetch(`/api/blogs?sort=${sort}`);
      const data = await res.json();
      setBlogs(data);
      setFilteredBlogs(
        data.filter((blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch (err) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false); // hide preloader
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [sort]);

  useEffect(() => {
    setFilteredBlogs(
      blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, blogs]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
        Car News
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow space-y-6 md:h-auto sticky top-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Search by Title
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* BLOG GRID */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <Preloader /> // ✅ show preloader while fetching
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
              >
                {/* IMAGE */}
                <Link to={`${blog._id}`} className="overflow-hidden">
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
                    to={`${blog._id}`}
                    className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600 mt-10">
              No blogs found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
