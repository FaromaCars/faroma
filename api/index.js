import dotenv from "dotenv";
dotenv.config();
import "./config/cloudinary.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import carRoutes from "./routes/carRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contact.js";
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Loaded ✅" : "Not Loaded ❌");
import path from 'path'

const __dirname = path.resolve()

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/cars", carRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/contact", contactRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.all('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.listen(process.env.PORT || 4000, () =>
  console.log(`Server running on port ${process.env.PORT || 4000}`)
);

