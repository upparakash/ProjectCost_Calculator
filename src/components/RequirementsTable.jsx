import React, { useState } from "react";
import "./RequirementsTable.css";

const RequirementsTable = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validation function
  const validateForm = () => {
    const { name, email, phone } = formData;
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (!nameRegex.test(name))
      newErrors.name = "Only letters and spaces are allowed.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email (e.g., akhila@gmail.com).";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(phone))
      newErrors.phone = "Enter a valid 10-digit number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Submit handler
  const handleSendPdf = async (e) => {
    e.preventDefault(); // 🚫 Prevent native form submit

    const isValid = validateForm();
    if (!isValid) {
      setStatusMessage("⚠️ Please fix the errors before submitting.");
      return false; // 🚫 Stops backend trigger even on Vercel
    }

    try {
      setLoading(true);
      setStatusMessage("📤 Sending email...");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      // ✅ Always use full backend URL
      const res = await fetch("https://app.aspireths.com/send-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response from backend:", text);
        throw new Error("Invalid response from server");
      }

      if (res.ok && data.success) {
        setStatusMessage("✅ Email sent successfully!");
        setFormData({ name: "", email: "", phone: "" });
      } else {
        throw new Error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setStatusMessage("❌ Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirements-container">
      <h2>Request Your PDF</h2>

      {/* ✅ onSubmit ensures Enter key also works */}
      <form className="user-form" noValidate onSubmit={handleSendPdf}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your 10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send PDF to Email"}
        </button>
      </form>

      {statusMessage && (
        <p
          className={`${
            statusMessage.startsWith("✅")
              ? "success-text"
              : "error-text"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default RequirementsTable;
