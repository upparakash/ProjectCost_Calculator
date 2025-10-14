import React from "react";
import android from "../assets/Android.png";
import ios from "../assets/ios.png";
import web from "../assets/web.png";

const platforms = [
  { name: "Android", price: 12000, image: android },
  { name: "iOS", price: 15000, image: ios },
  { name: "Web", price: 10000, image: web },
];

function PlatformSelection({ selectedPlatforms, setSelectedPlatforms }) {
  const togglePlatform = (platform) => {
    const exists = selectedPlatforms.some((p) => p.name === platform.name);

    if (exists) {
      // remove from selection
      setSelectedPlatforms(selectedPlatforms.filter((p) => p.name !== platform.name));
    } else {
      // add to selection
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

   return (
    <div className="platform-section">
      <h2 className="title">1. Choose Platform</h2>
      <div className="platform-list">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.some((p) => p.name === platform.name);
          return (
            <div
              key={platform.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => togglePlatform(platform)}
            >
              <img src={platform.image} alt={platform.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {platform.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlatformSelection;
