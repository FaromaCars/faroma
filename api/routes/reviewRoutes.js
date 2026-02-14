import express from "express";
import { createReview, getReviews,updateReview, deleteReview } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/add",authMiddleware, createReview);
router.get("/", getReviews);
router.put("/:id",authMiddleware, updateReview);
router.delete("/:id",authMiddleware, deleteReview);

export default router;
