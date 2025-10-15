import React from "react";

function Sidebar({
  selectedPlatforms = [],
  selectedSizes = [],
  selectedUis = [],
  selectedUsers = [],
  selectedGenerators = [],
  selectedDates = [],
  selectedEngagement=[],
 selectedBilling=[],
 selectedAdmins=[],
 selectedApis=[],
 selectedSecurity=[],
}) {
  const total =
    selectedPlatforms.reduce((acc, p) => acc + p.price, 0) +
    selectedSizes.reduce((acc, s) => acc + s.price, 0) +
    selectedUis.reduce((acc, u) => acc + u.price, 0) +
    selectedUsers.reduce((acc, us) => acc + us.price, 0) +
    selectedGenerators.reduce((acc, g) => acc + g.price, 0) +
    selectedDates.reduce((acc, d) => acc + d.price, 0)+
    selectedEngagement.reduce((acc,s)=>acc+s.price,0)+
    selectedBilling.reduce((acc,b)=>acc+b.price,0)+
     selectedAdmins.reduce((acc,a)=>acc+a.price,0)+
     selectedApis.reduce((acc,ap)=>acc+ap.price,0)+
     selectedSecurity.reduce((acc,s)=>acc+s.price,0);
  return (
    <div className="sidebar">
      <h3>Check your website estimation</h3>

      <ul>
        {selectedPlatforms.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>

      <ul>
        {selectedSizes.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>

      <ul>
        {selectedUis.map((u) => (
          <li key={u.name}>{u.name}</li>
        ))}
      </ul>

      <ul>
        {selectedUsers.map((us) => (
          <li key={us.name}>{us.name}</li>
        ))}
      </ul>

      <ul>
        {selectedGenerators.map((g) => (
          <li key={g.name}>{g.name}</li>
        ))}
      </ul>

      <ul>
        {selectedDates.map((d) => (
          <li key={d.name}>{d.name}</li>
        ))}
      </ul>
      <ul>
        {selectedEngagement.map((s)=>(
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
      <ul>
        {selectedBilling.map((b)=>(
          <li key={b.name}>{b.name}</li>)
        )}
      </ul>
      <ul>
        {selectedAdmins.map((a)=>(
          <li key={a.name}>{a.name}</li>)
        )}
      </ul>
      <ul>
        {selectedApis.map((ap)=>(
          <li key={ap.name}>{ap.name}</li>
        ))}
      </ul>
      <ul>
        {selectedSecurity.map((s)=>(
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>

      <h4>Total Cost: ₹{total}</h4>
    </div>
  );
}

export default Sidebar;
