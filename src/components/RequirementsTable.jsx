import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./RequirementsTable.css"; // Make sure to include the responsive CSS

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
  selectedSecurity
}) => {
  const tableRef = useRef();

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
    { id: 11, name: "Security", items: selectedSecurity }
  ];

  const grandTotal = requirements.reduce(
    (acc, req) => acc + getTotalPrice(req.items),
    0
  );

  const handleDownloadPDF = async () => {
    if (grandTotal === 0) {
      alert("Please select your requirements before downloading the PDF.");
      return;
    }

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
      const pdfWidth = pageWidth - 60;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 30, 130, pdfWidth, pdfHeight);
      addStyledFooter(pdf, 100 + pdfHeight);

      pdf.save("requirements-summary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
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

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        pdf.setFontSize(10);
        pdf.text(`Date: ${currentDate}`, pageWidth - 120, 25);
        pdf.text(`Time: ${currentTime}`, pageWidth - 120, 40);

        pdf.setTextColor(0, 0, 0);
        resolve();
      };

      logoImg.onerror = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 70, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", 40, 35);

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        pdf.setFontSize(10);
        pdf.text(`Date: ${currentDate}`, pageWidth - 120, 25);
        pdf.text(`Time: ${currentTime}`, pageWidth - 120, 40);

        pdf.setTextColor(0, 0, 0);
        resolve();
      };
    });
  };

  const addStyledFooter = (pdf, tableBottomY) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const footerY = pageHeight - 60;

    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, footerY, pageWidth, 60, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "Corporate Office: 1-8-303, 3rd Floor, VK Towers, SP Road, RasoolPura, Secunderabad - 500003",
      pageWidth / 2,
      footerY + 15,
      { align: "center" }
    );
    pdf.text(
      "040 4519 5642 | info@aspireths.com | www.aspireths.com",
      pageWidth / 2,
      footerY + 45,
      { align: "center" }
    );
    pdf.setTextColor(0, 0, 0);
  };

  return (
    <div
      className="requirements-table-container"
      style={{ marginTop: "20px" }}
      ref={tableRef}
    >
      <div style={{ overflowX: "auto" }}>
        <table className="requirements-table">
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
                  {req.items && req.items.length > 0
                    ? req.items.map((item) => item.name).join(", ")
                    : <span>None selected</span>}
                </td>
                <td>{getTotalPrice(req.items)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", background: "#e9ecef" }}>
              <td colSpan="2">Grand Total</td>
              <td>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px",
            background: grandTotal === 0 ? "#ccc" : "#fbce17",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: grandTotal === 0 ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "80px",
            marginTop: "30px",
          }}
        >
          Download PDF
        </button>
      </div>
      {/* hi */}
    </div>
  );
};

export default RequirementsTable;
