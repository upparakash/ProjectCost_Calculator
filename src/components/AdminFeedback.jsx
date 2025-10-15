import React from "react";
import Moderation from "../assets/Moderation.jpg";
import Multiligual from "../assets/Multilingual.png";
import Usage from "../assets/Usage Analytics.png";
import User from "../assets/User Analytics.png";
import crash from "../assets/Crash.png";
import CMS from "../assets/CMS.jpg";
import Performance from "../assets/Performance.png";
import intercom from "../assets/Intercom.png";

// Data for "Admin, Feedback & Analytics"
const Admins = [
  { name: "Moderation Approval", price: 12000, image: Moderation },
  { name: "Multilingual Support", price: 15000, image: Multiligual },
  { name: "Usage Analytics", price: 10000, image: Usage },
  { name: "User Analytics", price: 12000, image: User },
  { name: "Crash Reporting", price: 15000, image: crash },
  { name: "CMS Integration", price: 10000, image: CMS },
  { name: "User Admin pages", price: 10000, image: Performance },
  { name: "Intercom", price: 10000, image: intercom },
];

function AdminFeedback({ selectedAdmins, setSelectedAdmins, selectedPlatforms }) {
  const isDisabled = !selectedPlatforms || selectedPlatforms.length === 0;

  const toggleAdmin = (admin) => {
    if (isDisabled) return; // prevent selection if no platform

    const exists = selectedAdmins.some((a) => a.name === admin.name);
    if (exists) {
      setSelectedAdmins(selectedAdmins.filter((a) => a.name !== admin.name));
    } else {
      setSelectedAdmins([...selectedAdmins, admin]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">9. Admin, Feedback & Analytics</h2>

      <div
        className="platform-list"
        style={{
          pointerEvents: isDisabled ? "none" : "auto", // disable interaction if no platform
          opacity: isDisabled ? 1 : 1,              // visual feedback
          filter: isDisabled ? "grayscale(70%)" : "none",
        }}
      >
        {Admins.map((admin) => {
          const isSelected = selectedAdmins.some((a) => a.name === admin.name);
          return (
            <div
              key={admin.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleAdmin(admin)}
              style={{ cursor: isDisabled ? "default" : "pointer" }}
            >
              <img src={admin.image} alt={admin.name} className="platform-image" />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{admin.name}</p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminFeedback;
