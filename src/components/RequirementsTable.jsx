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
change my form date based on below code
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./RequirementsTable.css"

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
  const tableRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // ✅ to track email sending status
  const [statusMessage, setStatusMessage] = useState(""); // ✅ feedback message

  const getTotalPrice = (array) => {
    if (!array || array.length === 0) return 0;
    return array.reduce((acc, item) => acc + item.price, 0);
  };

  const requirements = [
    { id: 1, name: "Platform", items: selectedPlatforms },
    { id: 2, name: "Size", items: selectedSizes },
    { id: 3, name: "User Interface", items: selectedUis },
    { id: 4, name: "Social Login", items: selectedUsers },
    { id: 5, name: "User Content", items: selectedGenerators },
    { id: 6, name: "Locations", items: selectedDates },
    { id: 7, name: "Engagement", items: selectedEngagement },
    { id: 8, name: "Billing", items: selectedBilling },
    { id: 9, name: "Feedback", items: selectedAdmins },
    { id: 10, name: "External API", items: selectedApis },
    { id: 11, name: "Security", items: selectedSecurity },
  ];

  const grandTotal = requirements.reduce(
    (acc, req) => acc + getTotalPrice(req.items),
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendPdf = async () => {
    const { name, email, phone, message } = formData;
    if (!email || !name || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true); // ✅ show sending state
    setStatusMessage("📤 Sending email... Please wait.");

    try {
      const input = tableRef.current;
      const canvas = await html2canvas(input, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      await addStyledHeader(pdf);
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("REQUIREMENTS SUMMARY", pageWidth / 2, 110, { align: "center" });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 60;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 30, 130, pdfWidth, pdfHeight);

      addStyledFooter(pdf, 130 + pdfHeight);

      const pdfBlob = pdf.output("blob");
      const formDataToSend = new FormData();
      formDataToSend.append("email", email);
      formDataToSend.append("pdf", pdfBlob, "requirements-summary.pdf");
      formDataToSend.append("name", name);
      formDataToSend.append("phone", phone);
      formDataToSend.append("message", message);

      const res = await fetch("http://15.206.203.190:5000/send-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage("✅ Email sent successfully!");
      } else {
        setStatusMessage("❌ Failed to send email: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Error generating or sending PDF.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const addStyledHeader = (pdf) => {
    return new Promise((resolve) => {
      const logoUrl = "/AspireLogo.png";
      const logoImg = new Image();
      logoImg.crossOrigin = "Anonymous";
      logoImg.src = logoUrl;
      logoImg.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 70, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.addImage(logoImg, "PNG", 40, 10, 40, 40);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", 90, 35);
        pdf.setFontSize(10);
        const currentDate = new Date().toLocaleDateString();
        pdf.text(`Date: ${currentDate}`, pageWidth - 120, 35);
        pdf.setTextColor(0, 0, 0);
        resolve();
      };
    });
  };

  const addStyledFooter = (pdf, tableBottomY) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const footerY = Math.min(pageHeight - 70, tableBottomY + 20);
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, footerY, pageWidth, 60, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "Corporate Office: 1-8-303, 3rd Floor, VK Towers, SP Road, RasoolPura, Secunderabad - 500003",
      pageWidth / 2,
      footerY + 25,
      { align: "center" }
    );
    pdf.text(
      "040 4519 5642 | info@aspireths.com | www.aspireths.com",
      pageWidth / 2,
      footerY + 42,
      { align: "center" }
    );
  };

  return (
    <div className="requirements-container">
      <div className="requirements-table" ref={tableRef}>
        <table>
          <thead>
            <tr>
              <th>Requirement Questions</th>
              <th>Selected Specifications</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => (
              <tr key={req.id}>
                <td data-label="Requirement Questions">{req.name}</td>
                <td data-label="Selected Specifications">
                  {req.items && req.items.length > 0
                    ? req.items.map((item) => item.name).join(", ")
                    : "None selected"}
                </td>
                <td data-label="Total Price">{getTotalPrice(req.items)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="user-form">
        <h3>Where should we send you the detailed estimate?</h3>

        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Your Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Your Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="message">Your Message (optional)</label>
        <textarea
          id="message"
          name="message"
          placeholder="Write your message"
          value={formData.message}
          onChange={handleInputChange}
        />

        <button type="button" onClick={handleSendPdf} disabled={loading}>
          {loading ? "Sending..." : "Send PDF to Email"}
        </button>

        {/* ✅ Show status below the button */}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default RequirementsTable;

