import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const grandTotal = requirements.reduce((acc, req) => acc + getTotalPrice(req.items), 0);

  const handleDownloadPDF = async () => {
    try {
      const input = tableRef.current;
      const canvas = await html2canvas(input, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      // Add styled header
      await addStyledHeader(pdf);

      // Add centered "REQUIREMENTS SUMMARY" title below header
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("REQUIREMENTS SUMMARY", pageWidth / 2, 110, { align: "center" });

      // Scale up the image in the PDF (bigger table only in PDF)
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 60;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Position table below the "REQUIREMENTS SUMMARY" title
      pdf.addImage(imgData, "PNG", 30, 130, pdfWidth, pdfHeight);

      // Add styled footer closer to the table
      addStyledFooter(pdf, 130 + pdfHeight);

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

        // Blue background header
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 70, "F");

        // White text color
        pdf.setTextColor(255, 255, 255);
        pdf.addImage(logoImg, "PNG", 40, 10, 40, 40);

        // Company name
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", 90, 35);

        // Date (right side)
        const currentDate = new Date().toLocaleDateString();
        pdf.setFontSize(10);
        pdf.text(`Date: ${currentDate}`, pageWidth - 120, 35);

        // Reset text color
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
        pdf.setFontSize(10);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 120, 35);
        pdf.setTextColor("black");
        resolve();
      };
    });
  };

  const addStyledFooter = (pdf, tableBottomY) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Position footer close to table, but not cut off if table is long
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
    pdf.setTextColor(0, 0, 0);
  };

  return (
    <div className="requirements-table-container" style={{ marginTop: "20px" }} ref={tableRef}>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Requirement Questions</th>
            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Selected Specifications</th>
            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map(req => (
            <tr key={req.id}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{req.name}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {req.items && req.items.length > 0
                  ? req.items.map(item => item.name).join(", ")
                  : <span style={{ color: "#999", fontStyle: "italic" }}>None selected</span>}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {getTotalPrice(req.items)}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", background: "#e9ecef" }}>
            <td style={{ padding: "12px", border: "1px solid #ddd" }} colSpan="2">Grand Total</td>
            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px",
            background: "#4770DB",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default RequirementsTable;
