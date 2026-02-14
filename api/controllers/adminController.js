import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------------------------
// 1️⃣ Admin Login
// ---------------------------
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json("Admin not found");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ---------------------------
// 2️⃣ One-Time Admin Creation
// ---------------------------
export const createAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existing = await Admin.findOne({});
    if (existing)
      return res.status(400).json(
        "Admin already exists. This route is now disabled."
      );

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.json("Admin created successfully!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
