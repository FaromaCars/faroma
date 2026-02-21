import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your Gmail
    pass: process.env.GMAIL_PASS, // Gmail App Password
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) console.error("SMTP Error:", error);
  else console.log("SMTP Ready ✅");
});

router.post("/send-email", async (req, res) => {
  const {
    name,
    email,
    phone,
    enquiryType,
    enquiry,
    message,
    feedback,
    brand,
    carName,
    price,
    condition,
    year,
    kilometer,
    fuelType,
    transmission,
    seating,
    color,
    link,
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  try {
    // Determine subject and HTML body
    let subject, htmlBody;

    if (enquiryType === "Car Enquiry") {
      subject = `Car Enquiry - ${brand || ""} ${carName || ""}`;
      htmlBody = `
        <h2>Car Enquiry from Faroma Motor Trading Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${brand ? `<p><strong>Brand:</strong> ${brand}</p>` : ""}
        ${carName ? `<p><strong>Car Name:</strong> ${carName}</p>` : ""}
        ${price ? `<p><strong>Price:</strong> AED ${price}</p>` : ""}
        ${condition ? `<p><strong>Condition:</strong> ${condition}</p>` : ""}
        ${year ? `<p><strong>Year:</strong> ${year}</p>` : ""}
        ${kilometer ? `<p><strong>Mileage:</strong> ${kilometer} km</p>` : ""}
        ${fuelType ? `<p><strong>Fuel:</strong> ${fuelType}</p>` : ""}
        ${transmission ? `<p><strong>Transmission:</strong> ${transmission}</p>` : ""}
        ${seating ? `<p><strong>Seating:</strong> ${seating}</p>` : ""}
        ${color ? `<p><strong>Color:</strong> ${color}</p>` : ""}
        ${link ? `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>` : ""}
      `;
    } else {
      subject = "Contact Form from Faroma Website";
      htmlBody = `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${enquiry ? `<p><strong>Enquiry:</strong> ${enquiry}</p>` : ""}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ""}
      `;
    }

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "faromacars@gmail.com",
      subject,
      html: htmlBody,
      replyTo: email,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: `Failed to send email: ${err.message}` });
  }
});

export default router;