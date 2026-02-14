import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CarNewsDetails() {
  const { id } = useParams(); // get blog id from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      setBlog(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch blog");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
        <p>Blog not found.</p>
        <Link to="/blogs" className="mt-4 text-blue-600 hover:underline">
          Go back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="container mx-auto rounded-2xl overflow-hidden">
        {/* BLOG IMAGE */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover"
        />

        {/* BLOG CONTENT */}
        <div className="p-6 md:p-10 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {blog.title}
          </h1>
          <p className="text-gray-500">{blog.description}</p>
          <div className="prose prose-lg max-w-full text-gray-700">
            {/* Assuming blog.content is HTML formatted */}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <Link
            to="/car-news"
            className="mt-6 inline-block bg-blue-600 text-white text-center font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
