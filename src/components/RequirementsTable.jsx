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
      
      // Add custom header with logo
      await addCustomHeader(pdf);
      
      // Add the table image
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 80;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Position the table below the header
      pdf.addImage(imgData, "PNG", 40, 120, pdfWidth, pdfHeight);
      
      // Add styled footer - dynamically positioned
      addStyledFooter(pdf, 120 + pdfHeight); // Pass table end position
      
      pdf.save("requirements-summary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const addCustomHeader = (pdf) => {
    return new Promise((resolve) => {
      const logoUrl = "/AspireLogo.png"; // Your logo file
      const logoImg = new Image();
      logoImg.crossOrigin = "Anonymous";
      logoImg.src = logoUrl;

      logoImg.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        
        // Add logo on left side
        pdf.addImage(logoImg, "PNG", 40, 20, 50, 50);
        
        // Add company name next to logo
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", 100, 40);
        
        // Add tagline
        // pdf.setFontSize(12);
        // pdf.setFont("helvetica", "normal");
        // pdf.text("Let's Build Together", 100, 60);
        
        // Add date on right side
        const currentDate = new Date().toLocaleDateString();
        pdf.text(`Date: ${currentDate}`, pageWidth - 100, 40);
        
        // Add title
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("REQUIREMENTS SUMMARY", 40, 90);
        
        resolve();
      };

      logoImg.onerror = () => {
        // Fallback without logo
        console.log("Logo not found, using text-only header");
        const pageWidth = pdf.internal.pageSize.getWidth();
        
        // Company name
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("ASPIRE TEKHUB SOLUTIONS", pageWidth / 2, 30, { align: "center" });
        
        // Tagline
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text("Let's Build Together", pageWidth / 2, 50, { align: "center" });
        
        // Date
        const currentDate = new Date().toLocaleDateString();
        pdf.text(`Date: ${currentDate}`, pageWidth - 100, 30);
        
        // Title
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("REQUIREMENTS SUMMARY", 40, 80);
        
        resolve();
      };
    });
  };

  const addStyledFooter = (pdf, tableEndPosition) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate footer position - closer to table
    const footerTop = Math.min(tableEndPosition + 40, pageHeight - 60); // Reduced space
    const footerHeight = 60;
    
    // Blue background for footer
    pdf.setFillColor(59, 130, 246); // Blue color
    pdf.rect(0, footerTop, pageWidth, footerHeight, 'F'); // Blue rectangle
    
    // White text for footer
    pdf.setTextColor(255, 255, 255); // White color
    
    // Office address - larger font
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Corporate Office: 1-8-303, 3rd Floor, VK Towers, SP Road, RasoolPura, Secunderabad - 500003", 
             pageWidth / 2, footerTop + 25, { align: "center" });
    
    // Contact info - larger font
    pdf.setFontSize(12);
    pdf.text("040 45195642 | info@aspireths.com | www.aspireths.com", 
             pageWidth / 2, footerTop + 45, { align: "center" });
    
    // Reset text color to black for any future text
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