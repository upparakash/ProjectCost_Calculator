import React, { useRef, useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

  // --- compute total selections
  const totalSelectedCount = useMemo(() => {
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
    return all.reduce((acc, arr) => {
      if (Array.isArray(arr)) return acc + arr.length;
      return acc;
    }, 0);
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

  const hasSelections = totalSelectedCount > 0;

  // --- debug logging to console (visible on Vercel)
  useEffect(() => {
    console.log("RequirementsTable mounted/updated:");
    console.log("selectedPlatforms:", selectedPlatforms);
    console.log("selectedSizes:", selectedSizes);
    console.log("selectedUis:", selectedUis);
    console.log("selectedUsers:", selectedUsers);
    console.log("selectedGenerators:", selectedGenerators);
    console.log("selectedDates:", selectedDates);
    console.log("selectedEngagement:", selectedEngagement);
    console.log("selectedBilling:", selectedBilling);
    console.log("selectedAdmins:", selectedAdmins);
    console.log("selectedApis:", selectedApis);
    console.log("selectedSecurity:", selectedSecurity);
    console.log("totalSelectedCount:", totalSelectedCount);
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
    totalSelectedCount,
  ]);

  // --- helpers
  const getTotalPrice = (array) => {
    if (!Array.isArray(array) || array.length === 0) return 0;
    return array.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
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

  // --- form handlers (unchanged)
  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

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
// --- header/footer helpers (unchanged)
  const addStyledHeader = (pdf) =>
    new Promise((resolve) => {
      const logoUrl = "/AspireLogo.png";
      const logoImg = new Image();
      logoImg.crossOrigin = "Anonymous";
      logoImg.src = logoUrl;
      logoImg.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 70, "F");
        pdf.setTextColor(255, 255, 255);
        try {
          pdf.addImage(logoImg, "PNG", 40, 10, 40, 40);
        } catch (err) {
          console.warn("logo addImage failed", err);
        }
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", 90, 35);
        pdf.setFontSize(10);
        const currentDate = new Date().toLocaleDateString();
        pdf.text(Date: ${currentDate}, pageWidth - 120, 35);
        pdf.setTextColor(0, 0, 0);
        resolve();
      };
      logoImg.onerror = () => resolve();
    });

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

  // --- main submit
  const handleSendPdf = async (e) => {
    e.preventDefault();
    if (!hasSelections) {
      setStatusMessage("⚠️ Please select at least one requirement before sending.");
      return;
    }
    const isValid = validateForm();
    if (!isValid) {
      setStatusMessage("⚠️ Please fix the errors above before submitting.");
      return;
    }

    setLoading(true);
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
      formDataToSend.append("email", formData.email);
      formDataToSend.append("pdf", pdfBlob, "requirements-summary.pdf");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.message || "");

      const res = await fetch("https://app.aspireths.com/send-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
      }

      if (res.ok) {
        setStatusMessage("✅ Email sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatusMessage("❌ Failed to send email: " + (data.error || data.message || res.status));
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Error generating or sending PDF.");
    } finally {
      setLoading(false);
    }
  };

  // --- render
  return (
    <div className="requirements-container">
      <div className="debug-info">
        {/* Visible debug box — remove in production when fixed */}
        <strong>Debug:</strong> totalSelectedCount = {totalSelectedCount}
      </div>

      <div
        className="requirements-table"
        ref={tableRef}
        style={{ display: "block", position: "relative", zIndex: 5 }}
      >
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
                  {Array.isArray(req.items) && req.items.length > 0
                    ? req.items.map((item) => item.name).join(", ")
                    : "None selected"}
                </td>
                <td data-label="Total Price">{getTotalPrice(req.items)}</td>
              </tr>
            ))}
            <tr>
              <td />
              <td style={{ fontWeight: "bold" }}>Grand Total</td>
              <td style={{ fontWeight: "bold" }}>
                {requirements.reduce((acc, r) => acc + getTotalPrice(r.items), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {!hasSelections && (
        <p className="info-text">⚠️ Please select at least one requirement to proceed.</p>
      )}

      <div className={form-wrapper ${!hasSelections ? "disabled" : ""}}>
        <form onSubmit={handleSendPdf} noValidate>
          <fieldset disabled={!hasSelections} style={{ border: "none", padding: 0 }}>
            <label htmlFor="name">Your Name</label>
            <input id="name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleInputChange} />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <label htmlFor="email">Your Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email (e.g. akhila@gmail.com)" value={formData.email} onChange={handleInputChange} />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <label htmlFor="phone">Your Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="Enter your 10-digit number" value={formData.phone} onChange={handleInputChange} />
            {errors.phone && <p className="error-text">{errors.phone}</p>}

            <label htmlFor="message">Your Message (optional)</label>
            <textarea id="message" name="message" placeholder="Write your message" value={formData.message} onChange={handleInputChange} />

            <button type="submit" disabled={!hasSelections || loading}>
              {loading ? "Sending..." : "Send PDF to Email"}
            </button>
          </fieldset>
        </form>

        {!hasSelections && (
          <div className="form-overlay">
            <div>Please make at least one selection above to enable the form.</div>
          </div>
        )}
      </div>

      {statusMessage && (
        <p className={status-message ${statusMessage.startsWith("✅") ? "success-text" : "error-text"}}>{statusMessage}</p>
      )}
    </div>
  );
};

export default RequirementsTable;
