// RequirementsTable.jsx
import React, { useRef, useState, useMemo } from "react";
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
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Count selections robustly
  const totalSelectedCount = useMemo(() => {
    const arrays = [
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
    return arrays.reduce((acc, arr) => (Array.isArray(arr) ? acc + arr.length : acc), 0);
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

  const getTotalPrice = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
  };

  // ---------- Form handling & validation ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/; // requires tld length >=2
    const phoneRegex = /^\d{10}$/; // exactly 10 digits

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (!nameRegex.test(name)) newErrors.name = "Only letters and spaces allowed.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email (e.g., akhila@gmail.com).";

    if (!phone.trim()) newErrors.phone = "Phone is required.";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid 10-digit phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- PDF helpers ----------
  const addStyledHeader = (pdf) =>
    new Promise((resolve) => {
      const logoUrl = "/AspireLogo.png";
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = logoUrl;
      img.onload = () => {
        try {
          const w = pdf.internal.pageSize.getWidth();
          pdf.setFillColor(59, 130, 246);
          pdf.rect(0, 0, w, 70, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.addImage(img, "PNG", 40, 10, 40, 40);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.text("ASPIRE TEKHUB SOLUTIONS", 90, 35);
          pdf.setFontSize(10);
          const currentDate = new Date().toLocaleDateString();
          pdf.text(Date: ${currentDate}, w - 120, 35);
          pdf.setTextColor(0, 0, 0);
        } catch {
          // ignore image or layout errors
        }
        resolve();
      };
      img.onerror = () => resolve();
    });

  const addStyledFooter = (pdf, tableBottomY) => {
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    const footerY = Math.min(h - 70, tableBottomY + 20);
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, footerY, w, 60, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(
      "Corporate Office: 1-8-303, 3rd Floor, VK Towers, SP Road, RasoolPura, Secunderabad - 500003",
      w / 2,
      footerY + 25,
      { align: "center" }
    );
    pdf.text("040 4519 5642 | info@aspireths.com | www.aspireths.com", w / 2, footerY + 42, {
      align: "center",
    });
  };

// ---------- Actions ----------
  // Generate PDF (left panel) — disabled when no selections
  const handleGeneratePdf = async (e) => {
    e.preventDefault();
    if (!hasSelections) {
      setStatusMessage("⚠️ Please select at least one requirement before generating PDF.");
      return;
    }

    setStatusMessage("📤 Generating PDF...");
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

      // Download locally as preview (you can change behavior if you like)
      pdf.save("requirements-summary.pdf");
      setStatusMessage("✅ PDF generated (downloaded).");
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Error generating PDF.");
    }
  };

  // Send PDF to backend (right panel) — disabled when no selections or invalid fields
  const handleSendPdf = async (e) => {
    e.preventDefault();
    if (!hasSelections) {
      setStatusMessage("⚠️ Please select at least one requirement before sending.");
      return;
    }
    const valid = validateForm();
    if (!valid) {
      setStatusMessage("⚠️ Please fix errors before sending.");
      return;
    }

    setLoading(true);
    setStatusMessage("📤 Generating PDF & sending email...");

    try {
      // generate PDF blob
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

      const payload = new FormData();
      payload.append("email", formData.email);
      payload.append("pdf", pdfBlob, "requirements-summary.pdf");
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      payload.append("message", formData.message || "");

      const res = await fetch("https://app.aspireths.com/send-pdf", {
        method: "POST",
        body: payload,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
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

  // ---------- UI ----------
  return (
    <div className="rtc-container">
      <div className="rtc-grid">
        {/* LEFT: Requirements review + Generate PDF button */}
        <section className="rtc-panel rtc-panel-left">
          <h3 className="rtc-title">Requirements Summary</h3>

          <div className="rtc-table-wrap" ref={tableRef}>
            <table className="rtc-table">
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
                      {Array.isArray(req.items) && req.items.length > 0
                        ? req.items.map((it) => it.name).join(", ")
                        : "None selected"}
                    </td>
                    <td>{getTotalPrice(req.items)}</td>
                  </tr>
                ))}
                <tr className="rtc-grand-total">
                  <td />
                  <td style={{ fontWeight: 700 }}>Grand Total</td>
                  <td style={{ fontWeight: 700 }}>
                    {requirements.reduce((acc, r) => acc + getTotalPrice(r.items), 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rtc-actions">
            <button
              className="rtc-btn rtc-btn-primary"
              onClick={handleGeneratePdf}
              disabled={!hasSelections}
              title={!hasSelections ? "Select at least one requirement to enable" : "Generate and download PDF"}
            >
              Generate PDF (download)
            </button>

            {!hasSelections && <p className="rtc-note">Select at least one requirement to enable PDF generation.</p>}
          </div>
        </section>

        {/* RIGHT: User contact form + Send PDF */}
        <section className="rtc-panel rtc-panel-right">
          <h3 className="rtc-title">Send Detailed Estimate</h3>

          <form className={rtc-form} onSubmit={handleSendPdf} noValidate>
            <fieldset disabled={!hasSelections} className="rtc-fieldset">
              <label className="rtc-label" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                className={rtc-input ${errors.name ? "rtc-input-error" : ""}}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                type="text"
              />
              {errors.name && <div className="rtc-error">{errors.name}</div>}

              <label className="rtc-label" htmlFor="email">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                className={rtc-input ${errors.email ? "rtc-input-error" : ""}}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. akhila@gmail.com"
                type="email"
              />
              {errors.email && <div className="rtc-error">{errors.email}</div>}

              <label className="rtc-label" htmlFor="phone">
                Your Phone
              </label>
              <input
                id="phone"
                name="phone"
                className={rtc-input ${errors.phone ? "rtc-input-error" : ""}}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                type="tel"
              />
              {errors.phone && <div className="rtc-error">{errors.phone}</div>}

              <label className="rtc-label" htmlFor="message">
                Your Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                className="rtc-textarea"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Any additional notes (optional)"
              />

              <button className="rtc-btn rtc-btn-primary" type="submit" disabled={!hasSelections || loading}>
                {loading ? "Sending..." : "Send PDF to Email"}
              </button>
            </fieldset>
          </form>

          {/* overlay explanation when disabled (visible but form is disabled) */}
          {!hasSelections && (
            <div className="rtc-overlay">
              <div>Please select at least one requirement to enable sending the estimate.</div>
            </div>
          )}

          {statusMessage && (
            <div className={rtc-status ${statusMessage.startsWith("✅") ? "rtc-status-success" : "rtc-status-error"}}>
              {statusMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RequirementsTable;


  
