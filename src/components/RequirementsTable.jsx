import React, { useState, useMemo } from "react";
import "./RequirementsTable.css";

const RequirementsTable = ({
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
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // 🧮 Combine all selected options from all sections
  const allRequirements = useMemo(() => {
    const combine = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) => ({
            name: item.name || "Unnamed",
            price: Number(item.price) || 0,
          }))
        : [];

    return [
      ...combine(selectedPlatforms),
      ...combine(selectedSizes),
      ...combine(selectedUis),
      ...combine(selectedUsers),
      ...combine(selectedGenerators),
      ...combine(selectedDates),
      ...combine(selectedEngagement),
      ...combine(selectedBilling),
      ...combine(selectedAdmins),
      ...combine(selectedApis),
      ...combine(selectedSecurity),
    ];
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

  // 🧾 Calculate total
  const total = allRequirements.reduce((sum, item) => sum + item.price, 0);

  // ✅ Form handling
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("✅ Form submitted successfully!");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="table-form-wrapper">
      {/* =================== TABLE =================== */}
      <div className="requirements-table-container">
        <h3>Selected Requirements</h3>

        {allRequirements.length > 0 ? (
          <table className="requirements-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {allRequirements.map((req, index) => (
                <tr key={index}>
                  <td>{req.name}</td>
                  <td>{req.price}</td>
                </tr>
              ))}
              <tr className="grand-total-row">
                <td>Grand Total</td>
                <td>₹{total}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="no-items-text">No items selected yet.</p>
        )}
      </div>

      {/* =================== FORM =================== */}
      <form className="user-form" onSubmit={handleSubmit}>
        <h3>Contact Request</h3>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          placeholder="Enter number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          placeholder="Enter message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows="4"
        />

        <button type="submit">Submit</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
};

export default RequirementsTable;
