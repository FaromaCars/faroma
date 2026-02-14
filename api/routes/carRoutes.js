import express from "express";
import {
  addCar,
  getCars,
  getSingleCar,
  deleteCar,
  updateCar,
} from "../controllers/carController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

//////////////////////////////////////////////////
// PUBLIC ROUTES
//////////////////////////////////////////////////

// Get all cars + filters
router.get("/", getCars);

// Get single car
router.get("/:id", getSingleCar);

//////////////////////////////////////////////////
// ADMIN ROUTES
//////////////////////////////////////////////////

// Add car (multiple images)
router.post(
  "/add",
  authMiddleware,
  upload.array("images", 5),
  addCar
);

// Update car
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  updateCar
);

// Delete car
router.delete("/:id", authMiddleware, deleteCar);

export default router;
