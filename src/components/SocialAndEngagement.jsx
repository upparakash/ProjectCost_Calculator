import React from "react";
import social from "../assets/Social.jpg";
import message from "../assets/message.png";
import forums from "../assets/formus.png";
import Push from "../assets/Push.png"

// Data for social & engagement options
const Engagements = [
  { name: "Social Sharing", price: 12000, image: social },
  { name: "Messaging", price: 15000, image: message },
  { name: "Forums or commenting", price: 10000, image: forums },
   { name: "Push Facebook", price: 10000, image: Push },
];

function SocialAndEngagement({ selectedEngagement, setSelectedEngagement }) {
  const toggleEngagement = (engagement) => {
    const exists = selectedEngagement.some((e) => e.name === engagement.name);

    if (exists) {
      // remove from selection
      setSelectedEngagement(
        selectedEngagement.filter((e) => e.name !== engagement.name)
      );
    } else {
      // add to selection
      setSelectedEngagement([...selectedEngagement, engagement]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="title">7. Social & Engagement</h2>
      <div className="platform-list">
        {Engagements.map((engagement) => {
          const isSelected = selectedEngagement.some(
            (e) => e.name === engagement.name
          );
          return (
            <div
              key={engagement.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleEngagement(engagement)}
            >
              <img src={engagement.image} alt={engagement.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {engagement.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SocialAndEngagement;
