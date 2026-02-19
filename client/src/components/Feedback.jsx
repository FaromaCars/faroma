import React, { useState } from "react";
import background from "../assets/homebanner1.jpg";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState("New Cars");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!enquiry) newErrors.enquiry = "Enquiry about is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const whatsappMessage = `From Faroma Motor Trading Website \n\nName: ${name}\nEmail: ${email}\nEnquiry About: ${enquiry}\nMessage: ${message}\nFeedback: ${feedback}`;
    const whatsappNumber = "+971565471333"; // Replace with the actual WhatsApp number
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

  return (
    <div
      className="relative flex items-center justify-center my-5 bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative mx-0 lg:mx-20 z-10 w-full flex flex-col md:flex-row items-stretch justify-center p-8 lg:gap-10">
        <div className="flex-1 text-white max-w-xl flex flex-col justify-center">
          <span className="bg-white/10 px-4 py-1 w-fit rounded-full text-sm tracking-wide backdrop-blur">
            FAROMA MOTOR TRADING LLC
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-6 mb-6">
            Let’s Find Your <br />
            <span className="text-white">Perfect Vehicle</span>
          </h1>

          <p className="text-white text-lg leading-relaxed mb-6">
            Looking to import or purchase new or used vehicles? Our team helps
            dealers and individual buyers source reliable cars with the best
            global deals.
          </p>

          <div className="space-y-4 text-white text-lg">
            <div className="flex items-start gap-3">
              <p>➢ Import new & used vehicles worldwide</p>
            </div>

            <div className="flex items-start gap-3">
              <p>➢ Access to stock & auction vehicle purchasing</p>
            </div>

            <div className="flex items-start gap-3">
              <p>➢ Fast response & quick WhatsApp quotations</p>
            </div>
          </div>

          <p className="my-8 text-white text-lg">
            Fill the form and get a quick reply from our team.
          </p>
        </div>

        <div className="flex-1 backdrop-blur-lg bg-white/90 shadow-2xl rounded-3xl p-6 md:p-10 max-w-xl w-full flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Enquire Now
              </h1>
            </div>

            {/* NAME */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Eg: Walter White"
                id="name"
                autoComplete="off"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/80 transition"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Your Email *
              </label>
              <input
                type="email"
                placeholder="Eg: walter@email.com"
                id="email"
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/80 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* ENQUIRY */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Enquiry About *
              </label>
              <select
                id="enquiry"
                autoComplete="off"
                value={enquiry}
                onChange={(e) => {
                  setEnquiry(e.target.value);
                  setErrors({ ...errors, enquiry: "" });
                }}
                className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black/80 transition"
              >
                <option value="New Cars">New Cars</option>
                <option value="Used Cars">Used Cars</option>
                <option value="Other">Other</option>
              </select>
              {errors.enquiry && (
                <p className="text-red-500 text-sm">{errors.enquiry}</p>
              )}
            </div>

            {/* TEXTAREAS */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us what you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/80 transition resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Feedback
                </label>
                <textarea
                  rows="4"
                  placeholder="Your thoughts..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/80 transition resize-none"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="mt-2 bg-black text-white py-3 rounded-xl font-semibold tracking-wide hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition duration-300"
            >
              Send Message via WhatsApp →
            </button>
            <button
              type="submit"
              className=" bg-red-600 text-white py-3 rounded-xl font-semibold tracking-wide hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition duration-300"
            >
              Send Message via Email →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
