import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
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

  // ✔ Calculate total price for each section
  const getTotalPrice = (array) =>
    array && array.length > 0
      ? array.reduce((acc, item) => acc + item.price, 0)
      : 0;

  // ✔ All Categories
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

  // ✔ Grand Total
  const grandTotal = requirements.reduce(
    (acc, req) => acc + getTotalPrice(req.items),
    0
  );

  // ✔ Table details for backend
  const formatTableDetails = () => {
    return requirements
      .map(
        (req) =>
          `${req.name}: ${req.items.map((i) => i.name).join(", ") || "None"}`
      )
      .join("\n");
  };

  // ✔ Form handling
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✔ Header PDF
  const addStyledHeader = (pdf) => {
    return new Promise((resolve) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logo = new Image();
      logo.src = "/AspireLogo.png";

      logo.onload = () => {
        pdf.setFillColor(0, 74, 173);
        pdf.rect(0, 0, pageWidth, 60, "F");

        pdf.addImage(logo, "PNG", 20, 10, 40, 40);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);

        pdf.text("ASPIRE TEKHUB SOLUTIONS", pageWidth / 2, 30, {
          align: "center",
        });

        pdf.setFontSize(12);
        pdf.text(new Date().toLocaleDateString(), pageWidth - 70, 30);

        resolve();
      };
    });
  };

  // ✔ Footer PDF
  const addStyledFooter = (pdf) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(0, 74, 173);
    pdf.rect(0, pageHeight - 60, pageWidth, 60, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    pdf.text(
      "Corporate Office: VK Towers, SP Road, Secunderabad - 500003",
      pageWidth / 2,
      pageHeight - 35,
      { align: "center" }
    );

    pdf.text(
      "040 4519 5642 | info@aspireths.com | www.aspireths.com",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
  };

  // ✔ PDF GENERATOR — Complete & Clean
  const generateStyledPdf = async () => {
    const pdf = new jsPDF("p", "pt", "a4");

    await addStyledHeader(pdf);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 74, 173);

    pdf.text("REQUIREMENTS SUMMARY", pageWidth / 2, 110, {
      align: "center",
    });

    let rowY = 150;
    const startX = 40;
    const baseRowHeight = 25;

    // Column Widths
    const col = {
      category: 150,
      items: 250,
      price: 100,
    };

    // HEADER
    pdf.setFillColor(0, 74, 173);
    pdf.rect(startX, rowY, col.category + col.items + col.price, baseRowHeight, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("Category", startX + 5, rowY + 17);
    pdf.text("Selected Items", startX + col.category + 5, rowY + 17);
    pdf.text("Price (Rs.)", startX + col.category + col.items + 5, rowY + 17);

    rowY += baseRowHeight;

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");

    // ROWS
    for (let req of requirements) {
      const items = req.items.length > 0 ? req.items : [{ name: "None selected", price: 0 }];
      const totalPrice = getTotalPrice(req.items);

      const splitItems = pdf.splitTextToSize(
        items.map((i) => i.name).join("\n"),
        col.items - 10
      );

      const cellHeight = baseRowHeight + (splitItems.length - 1) * 14;
      const midY = rowY + cellHeight / 2 + 5;

      // Page break
      if (rowY + cellHeight > pageHeight - 100) {
        addStyledFooter(pdf);
        pdf.addPage();
        rowY = 40;
      }

      // CATEGORY
      pdf.rect(startX, rowY, col.category, cellHeight);
      pdf.text(req.name, startX + 5, rowY + 17);

      // ITEMS
      pdf.rect(startX + col.category, rowY, col.items, cellHeight);
      pdf.text(splitItems, startX + col.category + 5, rowY + 17);

      // PRICE
      pdf.rect(startX + col.category + col.items, rowY, col.price, cellHeight);
      const priceText = `Rs.${totalPrice.toLocaleString()}`;
      const pX =
        startX + col.category + col.items + col.price - pdf.getTextWidth(priceText) - 5;
      pdf.text(priceText, pX, midY);

      rowY += cellHeight;
    }

    // GRAND TOTAL
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 74, 173);
    pdf.rect(startX, rowY, col.category + col.items + col.price, baseRowHeight);
    pdf.text("Grand Total", startX + 5, rowY + 17);

    const totalText = `Rs.${grandTotal.toLocaleString()}`;
    const totalX =
      startX + col.category + col.items + col.price - pdf.getTextWidth(totalText) - 5;
    pdf.text(totalText, totalX, rowY + 17);

    addStyledFooter(pdf);

    return pdf.output("blob");
  };

  // ✔ SEND PDF
  const handleSendPdf = async () => {
    if (!validateForm()) {
      alert("⚠️ Fix errors before submitting!");
      return;
    }

    setLoading(true);

    try {
      const pdfBlob = await generateStyledPdf();

      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("grandTotal", grandTotal);
      formDataToSend.append("tableDetails", formatTableDetails());
      formDataToSend.append("pdf", pdfBlob, "requirements-summary.pdf");

      const res = await fetch("https://app.aspireths.com/send-app-email", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) alert("✅ Email sent successfully!");
      else alert("❌ Failed to send email.");
    } catch (err) {
      alert("❌ Error generating or sending PDF.");
    }

    setLoading(false);
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
                <td>{req.name}</td>
                <td>
                  {req.items.length > 0
                    ? req.items.map((i) => i.name).join(", ")
                    : "None selected"}
                </td>
                <td>{getTotalPrice(req.items)}</td>
              </tr>
            ))}

            <tr className="grand-total-row">
              <td colSpan="2" style={{ textAlign: "right" }}>
                <strong>Grand Total:</strong>
              </td>
              <td>
                <strong>₹{grandTotal}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FORM SECTION */}
      <form className="user-form" noValidate>
        <h3>Where should we send the detailed estimate?</h3>

        <label>Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <label>Your Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label>Your Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        <label>Your Message (Optional)</label>
        <textarea
          name="message"
          placeholder="Write your message..."
          value={formData.message}
          onChange={handleInputChange}
        />

        <button type="button" onClick={handleSendPdf} disabled={loading}>
          {loading ? "Sending..." : "Send PDF to Email"}
        </button>
      </form>
    </div>
  );
};

export default RequirementsTable;
