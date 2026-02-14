import express from "express";
import {
  addBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
} from "../controllers/blogController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

//////////////////////////////////////////////////
// PUBLIC ROUTES
//////////////////////////////////////////////////

// Get all blogs (latest / oldest)
router.get("/", getBlogs);

// Get single blog
router.get("/:id", getSingleBlog);

//////////////////////////////////////////////////
// ADMIN ROUTES
//////////////////////////////////////////////////

// Add blog (single image)
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  addBlog
);

// Update blog
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateBlog
);

// Delete blog
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
