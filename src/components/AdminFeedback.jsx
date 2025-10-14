import React from "react";
import Moderation from "../assets/Moderation.jpg";
import Multiligual from "../assets/Multilingual.png";
import Usage from "../assets/Usage Analytics.png";
import User from "../assets/User Analytics.png";
import crash from "../assets/Crash.png";
import CMS from "../assets/CMS.jpg";
import Performance from "../assets/Performance.png";
import intercom from "../assets/intercom.png";
// Data for "Users & Accounts"
const Admins = [
  { name: "search", price: 12000, image:Moderation },
  { name: "Tags", price: 15000, image:Multiligual},
  { name: "Transaction", price: 10000, image: Usage },
  { name: "blog", price: 12000, image: User },
  { name: "ratings", price: 15000, image: crash},
  { name: "File", price: 10000, image:CMS },
  { name: "User", price: 10000, image:Performance },
  { name: "Audio", price: 10000, image:intercom},
// { name: "Dashbord", price: 10000, image: Dashbord },
];

function AdminFeedback({ selectedAdmins, setSelectedAdmins}) {
  const toggleAdmin = (admin) => {
    const exists =selectedAdmins.some((a) => a.name === admin.name);
    if (exists) {
      setSelectedAdmins(selectedAdmins.filter((a) => a.name !== admin.name));
    } else {
      setSelectedAdmins([...selectedAdmins, admin]);
    }
  };

  return (
    <div className="user-section">
      <h2 className="title">9. Admin, Feedback & Analytics</h2>
      <div className="users-list">
        {Admins.map((admin) => {
          const isSelected = selectedAdmins.some((a) => a.name === admin.name);
          return (
            <div
              key={admin.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleAdmin(admin)}
            >
              <img src={admin.image} alt={admin.name} className="platform-image" />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {admin.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminFeedback;
