import React from "react";
import search from "../assets/search.png";
import Tags from "../assets/Tags.png";
import Transaction from "../assets/Transactional Emails.png";
import blog from "../assets/Blog Feed.png";
import ratings from "../assets/Ratings or reviews.png";
import File from "../assets/File Uploading.png"
import User from "../assets/User Profiles.png";
import Audio from "../assets/Audio.png";
import Dashbord from "../assets/Dashbord.png";
// Data for "Users & Accounts"
const Generators = [
  { name: "search", price: 12000, image: search },
  { name: "Tags", price: 15000, image: Tags },
  { name: "Transaction", price: 10000, image: Transaction },
  { name: "blog", price: 12000, image: blog },
  { name: "ratings", price: 15000, image: ratings},
  { name: "File", price: 10000, image: File },
  { name: "User", price: 10000, image: User },
  { name: "Audio", price: 10000, image: Audio },
{ name: "Dashbord", price: 10000, image: Dashbord },
];

function UsersAndGenerated({ selectedGenerators, setSelectedGenerators }) {
  const toggleGenerator = (gen) => {
    const exists = selectedGenerators.some((g) => g.name === gen.name);
    if (exists) {
      setSelectedGenerators(selectedGenerators.filter((g) => g.name !== gen.name));
    } else {
      setSelectedGenerators([...selectedGenerators, gen]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="sub">5. User Generated Content</h2>
      <div className="platform-list">
        {Generators.map((gen) => {
          const isSelected = selectedGenerators.some((g) => g.name === gen.name);
          return (
            <div
              key={gen.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleGenerator(gen)}
            >
              <img src={gen.image} alt={gen.name} className="platform-image" />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {gen.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersAndGenerated;
