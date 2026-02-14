import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

//////////////////////////////////////////////////////////////
// HELPER → upload image to cloudinary
//////////////////////////////////////////////////////////////
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "faroma_blogs",
        quality: "auto",        // compress for web
        fetch_format: "auto"
       },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

//////////////////////////////////////////////////////////////
// ADD BLOG
//////////////////////////////////////////////////////////////
export const addBlog = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content)
      return res.status(400).json("All fields are required");

    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      description,
      content,
      image: imageUrl,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};


//////////////////////////////////////////////////////////////
// GET ALL BLOGS (Latest / Oldest)
//////////////////////////////////////////////////////////////
export const getBlogs = async (req, res) => {
  try {
    const { sort } = req.query;

    let query = Blog.find();
    const limit = parseInt(req.query.limit) || 4;
    // latest → newest first
    if (sort === "latest") query.sort({ createdAt: -1 });

    // oldest → oldest first
    if (sort === "oldest") query.sort({ createdAt: 1 });
    query = query.limit(limit);
    const blogs = await query;
    res.json(blogs);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// SINGLE BLOG
//////////////////////////////////////////////////////////////
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json("Blog not found");

    res.json(blog);
  } catch (err) {
    res.status(500).json("Invalid blog ID");
  }
};


//////////////////////////////////////////////////////////////
// DELETE BLOG + CLOUDINARY IMAGE
//////////////////////////////////////////////////////////////
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json("Blog not found");

    // delete image from cloudinary
    if (blog.image) {
      const parts = blog.image.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = "faroma_blogs/" + fileName.split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json("Blog deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//////////////////////////////////////////////////////////////
// UPDATE BLOG
//////////////////////////////////////////////////////////////
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) return res.status(404).json("Blog not found");

    let imageUrl = existingBlog.image;

    // If new image uploaded → delete old + upload new
    if (req.file) {
      // delete old image
      if (existingBlog.image) {
        const parts = existingBlog.image.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = "faroma_blogs/" + fileName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // upload new image
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        image: imageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json("Failed to update blog");
  }
};

