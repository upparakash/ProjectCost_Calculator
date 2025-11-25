import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const tableRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // ---------- Price Calculation ----------
  const getTotalPrice = (array) => {
    if (!array || array.length === 0) return 0;
    return array.reduce((acc, item) => acc + (item.price || 0), 0);
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

  // ---------- Table Details ----------
  const formatTableDetails = () =>
    requirements
      .map((req) => {
        const selected =
          req.items?.length > 0
            ? req.items.map((i) => i.name).join(", ")
            : "None";
        return `${req.name}: ${selected}`;
      })
      .join("\n");

  // ---------- Input Handler ----------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------- Validation ----------
  const validateForm = () => {
    const { name, email, phone } = formData;
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (!nameRegex.test(name))
      newErrors.name = "Only letters and spaces allowed.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(phone))
      newErrors.phone = "Enter a valid 10-digit number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Generate & Send PDF ----------
  const handleSendPdf = async () => {
    if (!validateForm()) {
      setStatusMessage("⚠️ Please fix the errors above.");
      return;
    }

    setLoading(true);
    setStatusMessage("📤 Sending email...");

    try {
      // Generate PDF from table
      const input = tableRef.current;
      const canvas = await html2canvas(input, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      await addStyledHeader(pdf);
      pdf.setFontSize(16);
      pdf.text("APP REQUIREMENTS SUMMARY", 150, 40);

      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 20, 70, pdfWidth, pdfHeight);

      // Add Grand Total
      pdf.text(`Grand Total: ₹${grandTotal}`, 20, 80 + pdfHeight);

      const pdfFile = new File([pdf.output("blob")], "app-requirements.pdf", {
        type: "application/pdf",
      });
       addStyledFooter(pdf, totalY);

      // Prepare FormData
      const formDataToSend = new FormData();
      formDataToSend.append("pdf", pdfFile);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("grandTotal", grandTotal);
      formDataToSend.append("tableDetails", formatTableDetails());

      // Send to backend
      const response = await fetch("https://app.aspireths.com/send-app-email", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("✅ Email sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatusMessage("❌ " + (data.error || "Failed to send email"));
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Error sending PDF.");
    } finally {
      setLoading(false);
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

  // ✅ Styled footer
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
      {/* ---------- Requirements Table ---------- */}
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
                <td>{req.name}</td>
                <td>
                  {req.items?.length > 0
                    ? req.items.map((i) => i.name).join(", ")
                    : "None"}
                </td>
                <td>₹{getTotalPrice(req.items)}</td>
              </tr>
            ))}
            <tr className="grand-total-row">
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                Grand Total:
              </td>
              <td colSpan={2} style={{ fontWeight: "bold" }}>
                ₹{grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- User Form ---------- */}
      <form className="user-form" onSubmit={(e) => e.preventDefault()}>
        <h3>Where should we send your estimate?</h3>

        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleInputChange} />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleInputChange} />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleInputChange} />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        <label>Message (optional)</label>
        <textarea name="message" value={formData.message} onChange={handleInputChange} />

        <button type="button" onClick={handleSendPdf} disabled={loading}>
          {loading ? "Sending..." : "Send PDF to Email"}
        </button>

        {statusMessage && (
          <p
            className={
              statusMessage.startsWith("❌") || statusMessage.startsWith("⚠️")
                ? "error-text"
                : "success-text"
            }
          >
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default RequirementsTable;
