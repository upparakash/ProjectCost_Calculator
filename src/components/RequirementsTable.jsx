import React, { useState, useMemo } from "react";
import "./RequirementsTable.css";

const RequirementsTable = ({
  selectedPlatforms = [],
  selectedSizes = [],
  selectedUis = [],
  selectedUsers = [],
  selectedGenerators = [],
  selectedDates = [],
  selectedEngagement = [],
  selectedBilling = [],
  selectedAdmins = [],
  selectedApis = [],
  selectedSecurity = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Compute if user made any selections
  const hasSelections = useMemo(() => {
    const all = [
      selectedPlatforms,
      selectedSizes,
      selectedUis,
      selectedUsers,
      selectedGenerators,
      selectedDates,
      selectedEngagement,
      selectedBilling,
      selectedAdmins,
      selectedApis,
      selectedSecurity,
    ];
    // ensure all are arrays before checking length
    return all.some((arr) => Array.isArray(arr) && arr.length > 0);
  }, [
    selectedPlatforms,
    selectedSizes,
    selectedUis,
    selectedUsers,
    selectedGenerators,
    selectedDates,
    selectedEngagement,
    selectedBilling,
    selectedAdmins,
    selectedApis,
    selectedSecurity,
  ]);

  // ✅ Validation logic
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

  // ✅ Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Submit handler
  const handleSendPdf = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      setStatusMessage("⚠️ Please correct the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("📤 Sending email...");

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );

      const res = await fetch("https://app.aspireths.com/send-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.message) {
        setStatusMessage("✅ Email sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error(data.error || "Something went wrong.");
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
      {!hasSelections && (
        <p className="info-text">
          ⚠️ Please select at least one requirement to enable this form.
        </p>
      )}

      <div className={form-wrapper ${!hasSelections ? "disabled" : ""}}>
        <form onSubmit={handleSendPdf} noValidate>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={!hasSelections}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              disabled={!hasSelections}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Your Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={!hasSelections}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label>Your Message (optional)</label>
            <textarea
              name="message"
              placeholder="Write your message (optional)"
              value={formData.message}
              onChange={handleChange}
              disabled={!hasSelections}
            />
          </div>

          <button type="submit" disabled={!hasSelections || loading}>
            {loading ? "Sending..." : "Send PDF to Email"}
          </button>
        </form>

        {!hasSelections && (
          <div className="form-overlay">
            <p>Please make selections above to enable this form.</p>
          </div>
        )}
      </div>

      {statusMessage && (
        <p
          className={`status-message ${
            statusMessage.startsWith("✅") ? "success-text" : "error-text"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default RequirementsTable;
