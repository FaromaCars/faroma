// backend/routes/contact.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact/send-email
router.post("/send-email", async (req, res) => {
  const {
    name,
    email,
    phone,
    message,
    feedback,
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
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: "mail.faromamti.com", // HostGator SMTP
      port: 2525,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // info@faromamti.com
        pass: process.env.EMAIL_PASS, // email password
      },
    });

    let subject = "";
    let htmlBody = "";

    // ----------------- Feedback / Contact Form -----------------
    if (!enquiryType) {
      subject = "Contact Form from Faroma Website";
      htmlBody = `
        <h2>Form Enquriy from Faroma Motor Trading Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
        <p><strong>Feedback:</strong> ${feedback || "N/A"}</p>
      `;
    }

    // ----------------- Car Enquiry -----------------
    else if (enquiryType === "Car Enquiry") {
      subject = `Car Enquiry from Faroma Motor Trading Website - ${brand} ${carName}`;
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
    }

    // ----------------- Send Mail -----------------
    await transporter.sendMail({
      from: `"Faroma Motor Trading Website" <${process.env.EMAIL_USER}>`,
      to: "info@faromamti.com",
      subject,
      html: htmlBody,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;