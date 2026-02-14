import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

export default function BlogCreation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const editor = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Editor toolbar config
  const editorConfig = {
    readonly: false,
    height: 250,

    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "|",
      "undo",
      "redo",
      "|",
    ],

    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,

    // 🔥 VERY IMPORTANT → Fix paste issue
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",

    pastePlain: false,
    pasteFromWordRemoveStyles: false,

    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  //////////////////////////////////////////////////////
  // AUTH CHECK
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!token) navigate("/admin/login");
    fetchBlogs();
  }, []);

  //////////////////////////////////////////////////////
  // FETCH BLOGS
  //////////////////////////////////////////////////////
  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    }
  };

  //////////////////////////////////////////////////////
  // HANDLE INPUTS
  //////////////////////////////////////////////////////
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Max size = 300KB
    const maxSize = 400 * 1024; // bytes

    if (file.size > maxSize) {
      toast.error("Image must be less than 400KB");
      e.target.value = ""; // reset input
      return;
    }

    // Optional: allow only images
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  //////////////////////////////////////////////////////
  // ADD / UPDATE BLOG
  //////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content", form.content);

    if (image) formData.append("image", image);
    if (editId) formData.append("existingImage", preview);

    try {
      const url = editId ? `/api/blogs/${editId}` : "/api/blogs/add";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(editId ? "Blog Updated" : "Blog Added");

      setForm({ title: "", description: "", content: "" });
      setImage(null);
      setPreview("");
      setEditId(null);

      fetchBlogs();
    } catch {
      toast.error("Operation failed");
    }
  };

  //////////////////////////////////////////////////////
  // EDIT BLOG
  //////////////////////////////////////////////////////
  const handleEdit = (blog) => {
    setEditId(blog._id);
    setForm({
      title: blog.title,
      description: blog.description,
      content: blog.content,
    });
    setPreview(blog.image);
  };

  //////////////////////////////////////////////////////
  // DELETE BLOG
  //////////////////////////////////////////////////////
  const handleDelete = async (id) => {
    if (!window.confirm("Delete blog?")) return;

    await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchBlogs();
  };

  //////////////////////////////////////////////////////
  // PAGINATION
  //////////////////////////////////////////////////////
  const last = currentPage * itemsPerPage;
  const first = last - itemsPerPage;
  const currentBlogs = blogs.slice(first, last);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  //////////////////////////////////////////////////////
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Car News CMS</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Update Blog" : "Add Blog"}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
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

        <JoditEditor
          ref={editor}
          value={form.content}
          config={editorConfig}
          onChange={(newContent) =>
            setForm((prev) => ({ ...prev, content: newContent }))
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mt-4 mb-2"
        />
        <p className="text-sm text-green-500 mb-4">Max image size: 400KB</p>

        {preview && <img src={preview} className="w-32 mb-4 rounded" />}

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          {editId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      {/* BLOG TABLE */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="my-4">
            {currentBlogs.map((blog) => (
              <tr key={blog._id} className="border-b ">
                <td>
                  <img src={blog.image} className="w-20 mx-auto py-3" />
                </td>
                <td>{blog.title.slice(0,40) + "..."}</td>
                <td>{blog.description.slice(0,70) + "..."}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
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
