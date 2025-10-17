import React from "react";

function Sidebar({
  selectedPlatforms = [],
  selectedSizes = [],
  selectedUis = [],
  selectedUsers = [],
  selectedGenerators = [],
  selectedDates = [],
  selectedEngagement = [],
  selectedBilling = [],
  selectedAdmins = [],
  selectedApis = [],
  selectedSecurity = [],
}) {
  // ✅ Check if Web platform is selected
  const isWebSelected = selectedPlatforms.some((p) => p.name === "Web");

  // ✅ Adjust generator items: show names, set price 0 if Web is selected
  const generatorsToDisplay = selectedGenerators.map((g) => {
    return isWebSelected ? { ...g, price: 0 } : g;
  });

  const total =
    selectedPlatforms.reduce((acc, p) => acc + p.price, 0) +
    selectedSizes.reduce((acc, s) => acc + s.price, 0) +
    selectedUis.reduce((acc, u) => acc + u.price, 0) +
    selectedUsers.reduce((acc, us) => acc + us.price, 0) +
    generatorsToDisplay.reduce((acc, g) => acc + g.price, 0) +
    selectedDates.reduce((acc, d) => acc + d.price, 0) +
    selectedEngagement.reduce((acc, s) => acc + s.price, 0) +
    selectedBilling.reduce((acc, b) => acc + b.price, 0) +
    selectedAdmins.reduce((acc, a) => acc + a.price, 0) +
    selectedApis.reduce((acc, ap) => acc + ap.price, 0) +
    selectedSecurity.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="sidebar">
      <h3>Check your website estimation</h3>

      <ul>
        {selectedPlatforms.map((p) => (
          <li key={p.name}>
            {p.name} : {p.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedSizes.map((s) => (
          <li key={s.name}>
            {s.name} : {s.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedUis.map((u) => (
          <li key={u.name}>
            {u.name} : {u.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedUsers.map((us) => (
          <li key={us.name}>
            {us.name} : {us.price}
          </li>
        ))}
      </ul>

      {/* ✅ Always display generator names, price may be 0 */}
      {generatorsToDisplay.length > 0 && (
        <ul>
          {generatorsToDisplay.map((g) => (
            <li key={g.name}>
              {g.name} : {g.price}
            </li>
          ))}
        </ul>
      )}

      <ul>
        {selectedDates.map((d) => (
          <li key={d.name}>
            {d.name} : {d.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedEngagement.map((s) => (
          <li key={s.name}>
            {s.name} : {s.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedBilling.map((b) => (
          <li key={b.name}>
            {b.name} : {b.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedAdmins.map((a) => (
          <li key={a.name}>
            {a.name} : {a.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedApis.map((ap) => (
          <li key={ap.name}>
            {ap.name} : {ap.price}
          </li>
        ))}
      </ul>

      <ul>
        {selectedSecurity.map((s) => (
          <li key={s.name}>
            {s.name} : {s.price}
          </li>
        ))}
      </ul>

      <h4>Total Cost: ₹{total}</h4>
    </div>
  );
}

export default Sidebar;
