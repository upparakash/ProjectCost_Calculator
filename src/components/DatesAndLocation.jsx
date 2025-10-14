import React from "react";
import calender from "../assets/calender.png";
import Booking from "../assets/Booking.png";
import CustomMap from "../assets/custom map.png";
import Map from "../assets/map.png";
// Data for platforms
const Dates = [
  { name: "calender", price: 12000, image: calender },
  { name: "Booking", price: 15000, image: Booking },
  { name: "CustomMap", price: 10000, image: CustomMap},
   { name: "Map", price: 10000, image: Map},
];

function DatesAndLocation({ selectedDates, setSelectedDates }) {
  const toggleDate = (date) => {
    const exists = selectedDates.some((d) => d.name === date.name);

    if (exists) {
      // remove from selection
      setSelectedDates(selectedDates.filter((d) => d.name !== date.name));
    } else {
      // add to selection
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="title">6. Dates & Locations</h2>
      <div className="platform-list">
        {Dates.map((date) => {
          const isSelected = selectedDates.some((d) => d.name === date.name);
          return (
            <div
              key={date.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleDate(date)}
            >
              <img src={date.image} alt={date.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {date.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DatesAndLocation;
