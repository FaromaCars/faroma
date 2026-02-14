import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  brand: { type: String, required: true }, // store brand name as string
  year: { type: String, required: true }, // store model name as string
  price: Number,
  kilometer: Number,
  vehicleType: String,
  fuelType: String,
  seating: Number,
  color: String,
  transmission: String,
  featured: Boolean,
  condition: { type: String, default: "New" },
  description: String,
  images: [String], // URLs from Cloudinary
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
