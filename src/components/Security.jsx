import React from "react";
import Protection from "../assets/Protection.png";
import Dos from "../assets/Dos.png";
import CompleteProtection from "../assets/CompleteProtection.png"
import BasicSecurity from "../assets/BasicSecurity.png";
import TwoFactor from "../assets/TwoFactor.png";
import SSL from "../assets/SSL.png";

// Data for Billing & eCommerce
const sec = [
  { name: " Security Not Important", price: 12000, image: Protection },
  { name: "DoS protection", price: 15000, image: Dos },
  { name: "Basic Security Measures ", price: 10000, image:BasicSecurity },
  { name: "Complete Protection", price: 10000, image: CompleteProtection },
  { name: "Two Factor Authentication", price: 10000, image: TwoFactor },
  { name: "SSL Certificate", price: 10000, image: SSL },
];

function Security({ selectedSecurity, setSelectedSecurity, selectedPlatforms }) {
  const isDisabled = !selectedPlatforms || selectedPlatforms.length === 0;

  const toggleSecurity = (secu) => {
    if (isDisabled) return; // prevent selection if no platform

    const exists = selectedSecurity.some((s) => s.name === secu.name);
    if (exists) {
      setSelectedSecurity(selectedSecurity.filter((s) => s.name !== secu.name));
    } else {
      setSelectedSecurity([...selectedSecurity, secu]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">11. Security</h2>
      <div className="platform-list">
        {sec.map((secu) => {
          const isSelected = selectedSecurity.some((s) => s.name === secu.name);

          return (
            <div
              key={secu.name}
              className={`platform-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              onClick={() => toggleSecurity(secu)}
              style={{
                pointerEvents: isDisabled ? "none" : "auto",
                cursor: isDisabled ? "default" : "pointer",
                opacity: isDisabled ? 1 : 1,
              }}
            >
              <img src={secu.image} alt={secu.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{secu.name}</p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Security;
