import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Nodemailer Gmail transporter
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
    logger: true,
    debug: true,     // your Gmail App Password (or regular password if using less secure apps)
  },
});


router.post("/send-email", async (req, res) => {
  const {
    name,
    email,
    phone,
    enquiry,
    enquiryType,
    carName,
    brand,
    condition,
    price,
    year,
    kilometer,
    fuelType,
    transmission,
    seating,
    color,
    link,
    message,
    feedback,
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  try {
    let subject = "";
    let htmlBody = "";

    if (enquiryType === "Car Enquiry") {
      subject = `Car Enquiry - ${brand} ${carName}`;
      htmlBody = `
        <h2>Car Enquiry from Faroma Motor Trading Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Car:</strong> ${brand} ${carName}</p>
        <p><strong>Price:</strong> AED ${price}</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Mileage:</strong> ${kilometer} km</p>
        <p><strong>Fuel:</strong> ${fuelType}</p>
        <p><strong>Transmission:</strong> ${transmission}</p>
        <p><strong>Seating:</strong> ${seating}</p>
        <p><strong>Color:</strong> ${color}</p>
        <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
      `;
    } else if (enquiryType === "General Enquiry") {
      // fallback for generic contact
      subject = "Contact Form from Faroma Website";
      htmlBody = `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Enquiry:</strong> ${enquiry}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
        <p><strong>Feedback:</strong> ${feedback || "N/A"}</p>
      `;
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "faromacars@gmail.com", // your receiving email
      subject,
      html: htmlBody,
      replyTo: email, // reply directly to user
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Nodemailer Error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;