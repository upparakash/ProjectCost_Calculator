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

  // Calculate grand total
  const grandTotal = requirements.reduce((acc, req) => acc + getTotalPrice(req.items), 0);

  const handleDownloadPDF = async () => {
    try {
      const input = tableRef.current;
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      
      // Add clean header without logo attempt
      addHeaderToPDF(pdf);
      
      // Add the table image
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 80;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Position the table below the header
      pdf.addImage(imgData, "PNG", 40, 100, pdfWidth, pdfHeight);
      
      // Add footer
      addFooterToPDF(pdf);
      
      pdf.save("requirements-summary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const addHeaderToPDF = (pdf) => {
    // Clean header without logo - just company name and details
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("ASPIRE TEKHUB SOLUTIONS", 40, 40);
    
    // Add phone number
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("040 4519 5642", 40, 60);

    // Add date on right side
    const currentDate = new Date().toLocaleDateString();
    pdf.text(`Date: ${currentDate}`, pdf.internal.pageSize.getWidth() - 120, 40);
    
    // Add title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("REQUIREMENTS SUMMARY", 40, 85);
  };

  const addFooterToPDF = (pdf) => {
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Corporate Office : 1-8-303, 4th Floor, VK Towers, SP Road, RasoolPura, Secunderabad - 500003", 40, pageHeight - 340);
    pdf.text("040 4519 5642 | info@aspireths.com | www.aspireths.com", 40, pageHeight - 320);
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
                  : <span style={{ color: "#999", fontStyle: "italic" }}>None selected</span>
                }
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {getTotalPrice(req.items)}
              </td>
            </tr>
          ))}

          {/* Grand Total Row */}
          <tr style={{ fontWeight: "bold", background: "#e9ecef" }}>
            <td style={{ padding: "12px", border: "1px solid #ddd" }} colSpan="2">Grand Total</td>
            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Button below table */}
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