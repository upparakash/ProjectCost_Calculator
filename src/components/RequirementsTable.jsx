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

  const handleDownloadPDF = () => {
    const input = tableRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("requirements-summary.pdf");
    });
  };

  return (
    <div className="requirements-table-container" style={{ marginTop: "20px" }} ref={tableRef}>
      <h2 style={{ marginBottom: "10px" }}>Requirements Summary</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Requirement Questions</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Selected Specifications</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map(req => (
            <tr key={req.id}>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{req.name}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                {req.items && req.items.length > 0
                  ? req.items.map(item => item.name).join(", ")
                  : <span style={{ color: "#999" }}>None</span>
                }
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                {getTotalPrice(req.items)}
              </td>
            </tr>
          ))}

          {/* ✅ Grand Total Row */}
          <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>Total</td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}></td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Button below table */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button 
          onClick={handleDownloadPDF} 
          style={{ padding: "8px 15px", background: "#4770DB", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default RequirementsTable;
