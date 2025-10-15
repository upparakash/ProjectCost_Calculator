import React from "react";
import Mvp from "../assets/mvp.png";
import Basic from "../assets/basic.jpg";
import Polish from "../assets/polish.png";

const uiOptions = [
  { name: "Mvp", price: 8000, image: Mvp },
  { name: "Basic", price: 10000, image: Basic },
  { name: "Polished", price: 12000, image: Polish },
];

function UiSelection({ selectedUis, setSelectedUis }) {
  const toggleUi = (ui) => {
    const exists = selectedUis.some((u) => u.name === ui.name);

    if (exists) {
      // Unselect if the same one is clicked again
      setSelectedUis([]);
    } else {
      // Replace with the new single selection
      setSelectedUis([ui]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">3. Choose UI</h2>
      <div className="platform-list">
        {uiOptions.map((ui) => {
          const isSelected = selectedUis.some((u) => u.name === ui.name);
          return (
            <div
              key={ui.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleUi(ui)}
            >
              <img
                src={ui.image}
                alt={ui.name}
                style={{ width: "60px", height: "60px", marginBottom: "5px" }}
              />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {ui.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UiSelection;
