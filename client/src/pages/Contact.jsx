import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { toast } from "react-toastify";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");

  const handleWhatsapp = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!enquiry) newErrors.enquiry = "Enquiry about is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const whatsappMessage = `From Faroma Motor Trading International LLC Website \n\nName: ${name}\nEmail: ${email}\nEnquiry About: ${enquiry}\nMessage : ${message}\nFeedback: ${feedback}`;
    const whatsappNumber = "+971565471333";

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    window.open(whatsappURL, "_blank");

    setName("");
    setEmail("");
    setEnquiry("");
    setMessage("");
    setFeedback("");
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!enquiry) newErrors.enquiry = "Enquiry about is required";
    if (!phone) newErrors.phone = "Phone Number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          enquiry,
          message,
          feedback,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email sent successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setEnquiry("");
        setMessage("");
        setFeedback("");
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="my-5 md:my-10 text-center py-4 flex flex-col gap-3 p-4">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Have Questions? <span className="text-gray-700">Get In Touch</span>
        </h1>

        <span className="text-slate-500 text-sm md:text-base">
          Monday-Sunday (10:00 AM - 9:00 PM hrs)
        </span>

        <div className="flex flex-col-reverse lg:flex-row p-1">
          {/* Contact Info */}
          <div className="flex flex-col mt-4 lg:ms-10 justify-center">
            {/* Location */}
            <div className="bg-gray-50 p-8 m-5 shadow-lg rounded-md ">
              <div className="flex flex-col md:flex-row items-center  gap-5">
                <div className="bg-gray-700 rounded-full p-5">
                  <FaLocationDot className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base">
                    Meydan Grandstand - 6th Floor Al Meydan Rd <br /> Nadd Al
                    Shiba First - Dubai
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Our Location</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 p-8 m-5 shadow-lg rounded-md">
              <div className="flex flex-col md:flex-row items-center  gap-5">
                <div className="bg-gray-700 rounded-full p-5">
                  <FaPhoneAlt className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <a href="tel:+971565471333" className="block hover:underline">
                    +971 56 547 1333
                  </a>
                  <p className="text-gray-500 text-sm mt-1">Let's Talk</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-8 m-5 shadow-lg rounded-md">
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="bg-gray-700 rounded-full p-5">
                  <IoMdMail className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <a
                    href="mailto:info@faromamti.com"
                    className="hover:underline"
                  >
                    info@faromamti.com
                  </a>
                  <p className="text-gray-500 text-sm mt-1">Drop a Line</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1 bg-gray-50 p-8 m-5 shadow-lg rounded-md text-start">
            <form className="flex flex-col gap-5">
              <h2 className="text-gray-700 text-2xl font-semibold">
                Enquire Now
              </h2>

              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Your Email *
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1 mt-3 md:mt-0">
                <label className="text-sm font-medium text-gray-600">
                  Your Phone *
                </label>
                <input
                  type="number"
                  placeholder="Eg: +971 2233 4455"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors({ ...errors, phone: "" });
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/80 transition [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              {/* Enquiry */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Enquiry About *
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  value={enquiry}
                  onChange={(e) => {
                    setEnquiry(e.target.value);
                    setErrors({ ...errors, enquiry: "" });
                  }}
                >
                  <option value="">Select Option</option>
                  <option value="New Cars">New Cars</option>
                  <option value="Used Cars">Used Cars</option>
                  <option value="Other">Other</option>
                </select>
                {errors.enquiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.enquiry}</p>
                )}
              </div>

              {/* Message & Feedback */}
              <div className="flex flex-col md:flex-row gap-3">
                <textarea
                  rows="4"
                  placeholder="Your Message (Optional)"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <textarea
                  rows="4"
                  placeholder="Your Feedback (Optional)"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={handleWhatsapp}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Send Via Whatsapp
              </button>
              <button
                type="button"
                onClick={handleEmailSend}
                className="bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Send Via Email
              </button>
            </form>
          </div>
        </div>

        {/* Google Map */}
        <div className="p-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.3725400055223!2d55.3005168!3d25.156895799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69270f5612c3%3A0x2d7e43041843e7d8!2sMeydan%20Free%20Zone%20-%20Business%20Setup%20In%20Dubai%2C%20UAE!5e0!3m2!1sen!2sae!4v1771656077346!5m2!1sen!2sae"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
