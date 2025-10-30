import React, { useRef, useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// keep your CSS import if you want, but we use inline styles to prevent CSS-missing hiding issues
// import "./RequirementsTable.css";

const inlineStyles = {
  container: { maxWidth: 980, margin: "16px auto", padding: 12, fontFamily: "Inter, Arial, sans-serif" },
  debugBox: { background: "#f0f8ff", border: "1px solid #d0e7ff", padding: 10, borderRadius: 6, marginBottom: 12 },
  tableWrap: { display: "block", position: "relative", zIndex: 99, background: "#fff", borderRadius: 6, overflow: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 600 },
  thtd: { padding: "10px 12px", border: "1px solid #eee", textAlign: "left", background: "#fff" },
  infoText: { color: "#555", margin: "8px 0" },
  formWrapper: { position: "relative", marginTop: 12 },
  overlay: { position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.9)", zIndex: 90, pointerEvents: "none", borderRadius: 6 },
  input: { padding: "8px", borderRadius: 6, border: "1px solid #ccc", width: "100%", boxSizing: "border-box" },
  textarea: { padding: "8px", borderRadius: 6, border: "1px solid #ccc", width: "100%", minHeight: 90, boxSizing: "border-box" },
  button: { padding: "10px 14px", borderRadius: 8, border: "none", background: "#0b74de", color: "#fff", cursor: "pointer", width: "100%" },
  error: { color: "red", fontSize: 13, marginTop: 6 },
  status: { marginTop: 10, fontWeight: 600 },
};

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
  const tableRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // robust totalSelectedCount
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
    return all.reduce((acc, arr) => (Array.isArray(arr) ? acc + arr.length : acc), 0);
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

  // DEBUG: visible props for Vercel diagnosis
  useEffect(() => {
    // visible console logs for Vercel
    console.log("RequirementsTable props (debug):");
    console.log({ selectedPlatforms, selectedSizes, selectedUis, selectedUsers, selectedGenerators, selectedDates, selectedEngagement, selectedBilling, selectedAdmins, selectedApis, selectedSecurity });
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
    else if (!nameRegex.test(name)) newErrors.name = "Only letters and spaces are allowed.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email (e.g., akhila@gmail.com).";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid 10-digit number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  return (
    <div style={inlineStyles.container}>
      {/* DEBUG — remove when fixed */}
      <div style={inlineStyles.debugBox}>
        <strong>Debug props (visible on page):</strong>
        <div style={{ marginTop: 6 }}>
          <pre style={{ margin: 0, fontSize: 12 }}>
            {JSON.stringify(
              {
                totalSelectedCount,
                selectedPlatformsLen: Array.isArray(selectedPlatforms) ? selectedPlatforms.length : "not-array",
                selectedSizesLen: Array.isArray(selectedSizes) ? selectedSizes.length : "not-array",
                selectedUisLen: Array.isArray(selectedUis) ? selectedUis.length : "not-array",
                selectedApisLen: Array.isArray(selectedApis) ? selectedApis.length : "not-array",
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* Requirements table (always rendered; inline styles avoid CSS hiding) */}
      <div ref={tableRef} style={inlineStyles.tableWrap} className="requirements-table">
        <table style={inlineStyles.table}>
          <thead>
            <tr>
              <th style={inlineStyles.thtd}>Requirement Questions</th>
              <th style={inlineStyles.thtd}>Selected Specifications</th>
              <th style={inlineStyles.thtd}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => (
              <tr key={req.id}>
                <td style={inlineStyles.thtd}>{req.name}</td>
                <td style={inlineStyles.thtd}>
                  {Array.isArray(req.items) && req.items.length > 0
                    ? req.items.map((it) => it.name).join(", ")
                    : "None selected"}
                </td>
                <td style={inlineStyles.thtd}>{getTotalPrice(req.items)}</td>
              </tr>
            ))}
            <tr>
              <td style={inlineStyles.thtd} />
              <td style={{ ...inlineStyles.thtd, fontWeight: 700 }}>Grand Total</td>
              <td style={{ ...inlineStyles.thtd, fontWeight: 700 }}>
                {requirements.reduce((acc, r) => acc + getTotalPrice(r.items), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {!hasSelections && <p style={inlineStyles.infoText}>⚠️ Please select at least one requirement to proceed.</p>}

      <div style={inlineStyles.formWrapper} className={!hasSelections ? "disabled" : ""}>
        <form onSubmit={handleSendPdf} noValidate>
          <fieldset disabled={!hasSelections} style={{ border: "none", padding: 0 }}>
            <div style={{ marginBottom: 8 }}>
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" style={inlineStyles.input} value={formData.name} onChange={handleInputChange} />
              {errors.name && <div style={inlineStyles.error}>{errors.name}</div>}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="email">Your Email</label>
              <input id="email" name="email" style={inlineStyles.input} value={formData.email} onChange={handleInputChange} />
              {errors.email && <div style={inlineStyles.error}>{errors.email}</div>}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="phone">Your Phone</label>
              <input id="phone" name="phone" style={inlineStyles.input} value={formData.phone} onChange={handleInputChange} />
              {errors.phone && <div style={inlineStyles.error}>{errors.phone}</div>}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="message">Your Message (optional)</label>
              <textarea id="message" name="message" style={inlineStyles.textarea} value={formData.message} onChange={handleInputChange} />
            </div>

            <button type="submit" style={inlineStyles.button} disabled={!hasSelections || loading}>
              {loading ? "Sending..." : "Send PDF to Email"}
            </button>
          </fieldset>
        </form>

        {!hasSelections && <div style={inlineStyles.overlay}>Please make at least one selection above to enable the form.</div>}
      </div>

      {statusMessage && (
        <div style={{ ...inlineStyles.status, color: statusMessage.startsWith("✅") ? "green" : "red" }}>{statusMessage}</div>
      )}
    </div>
  );
};

export default RequirementsTable;























