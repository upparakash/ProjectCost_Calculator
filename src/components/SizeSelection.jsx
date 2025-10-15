import React from "react";
import small from "../assets/s.png";
import Large from "../assets/l.png";
import Medium from "../assets/m.png";

const sizes = [
  { name: "Small", price: 5000, image: small },
  { name: "Medium", price: 10000, image: Medium },
  { name: "Large", price: 15000, image: Large },
];

function SizeSelection({ selectedSizes, setSelectedSizes }) {
  const toggleSize = (size) => {
    const isSelected = selectedSizes.some((s) => s.name === size.name);

    if (isSelected) {
      // Unselect if the same one is clicked again
      setSelectedSizes([]);
    } else {
      // Replace with the new single selection
      setSelectedSizes([size]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">2. Choose Size</h2>
      <div className="platform-list">
        {sizes.map((size) => {
          const isSelected = selectedSizes.some((s) => s.name === size.name);
          return (
            <div
              key={size.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSize(size)}
            >
              <img
                src={size.image}
                alt={size.name}
                style={{ width: "60px", height: "60px", marginBottom: "5px" }}
              />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {size.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SizeSelection;
