import React from "react";
import Sms from "../assets/SMS.jpg";
import Phone from  "../assets/Phone.png";
import Api from "../assets/API.png";
import Connection from "../assets/Connect.png";

// Data for social & engagement options
const Apis = [
  { name: "Phone Number Masking", price: 12000, image: Sms },
  { name: "SMS Messaging", price: 15000, image: Phone },
  { name: "API integrate", price: 10000, image:  Api },
  { name: "Connect more services", price: 10000, image: Connection },
];

function ExternalApis({ selectedApis, setSelectedApis, selectedPlatforms }) {
  const isDisabled = !selectedPlatforms || selectedPlatforms.length === 0;

  const toggleApis = (Api) => {
    if (isDisabled) return; // prevent selection if no platform

    const exists = selectedApis.some((ap) => ap.name === Api.name);
    if (exists) {
     setSelectedApis(selectedApis.filter((ap) => ap.name !== Api.name));
    } else {
     setSelectedApis([...selectedApis, Api]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">10. External APIs and Integrations</h2>
      <div
        className="platform-list"
        style={{
          pointerEvents: isDisabled ? "none" : "auto", // disable interaction
          opacity: isDisabled ? 1 : 1,              // visual feedback
          filter: isDisabled ? "grayscale(70%)" : "none",
        }}
      >
        { Apis.map((Apis) => {
          const isSelected =selectedApis.some((Api) => Api.name === Apis.name);

          return (
            <div
              key={Apis.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleApis(Apis)}
              style={{ cursor: isDisabled ? "default" : "pointer" }}
            >
              <img src={Apis.image} alt={Apis.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{Apis.name}</p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExternalApis;
