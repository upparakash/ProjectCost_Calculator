import React from "react";
import Mvp from "../assets/mvp.png";
import Basic from "../assets/basic.jpg";
import Polish from "../assets/polish.png";

// Data for platforms
const uiOptions = [
  { name: "Mvp", price: 12000, image: Mvp},
  { name: "Basic", price: 15000, image: Basic},
  { name: "Polished", price: 10000, image: Polish},
  
];

function UiSelection({ selectedUis, setSelectedUis }) {
  const toggleUi = (ui) => {
    const exists = selectedUis.some((u) => u.name === ui.name);

    if (exists) {
      // remove from selection
      setSelectedUis(selectedUis.filter((u) => u.name !== ui.name));
    } else {
      // add to selection
      setSelectedUis([...selectedUis, ui]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="title">3. Choose Ui</h2>
      <div className="platform-list">
        {uiOptions.map((ui) => {
          const isSelected = selectedUis.some((u) => u.name === ui.name);
          return (
            <div
              key={ui.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleUi(ui)}
            >
              <img src={ui.image} alt={ui.name} />
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
