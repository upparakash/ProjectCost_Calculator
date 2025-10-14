import React from "react";
import small from "../assets/s.png";
import Large from "../assets/l.png";
import Medium from "../assets/m.png";
const sizes = [
  { name: "Small", price: 5000,image:small },
  { name: "Medium", price: 10000,image:Medium },
  { name: "Large", price: 15000 ,image:Large},
];

function SizeSelection({ selectedSizes, setSelectedSizes }) {
  const toggleSize = (size) => {
    const exists = selectedSizes.some((s) => s.name === size.name);

    if (exists) {
      setSelectedSizes(selectedSizes.filter((s) => s.name !== size.name));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
   <div className="platform-section">
      <h2 className="title">2. Choose Size</h2>
      <div className="platform-list">
        {sizes.map((size) => {
          const isSelected = selectedSizes.some((s) => s.name === size.name);
          return (
            <div
              key={size.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSize(size)}
            >
              {/* Display image */}
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
