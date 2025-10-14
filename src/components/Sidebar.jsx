import React from "react";

function Sidebar({ selectedPlatforms, selectedSizes,selectedUis,selectedUsers,selectedGenerators }) {
  const total =
    selectedPlatforms.reduce((acc, p) => acc + p.price, 0) +
    selectedSizes.reduce((acc, s) => acc + s.price, 0)+
    selectedUis.reduce((acc,u) => acc+u.price,0)+
     selectedUsers.reduce((acc,us) => acc+us.price,0)+
     selectedGenerators.reduce((acc, g) => acc + g.price, 0);

  return (
    <div className="sidebar">
      <h3>Check your website estimation</h3>

      {/* <p><strong>Selected Platforms:</strong></p> */}
      <ul>
  {selectedPlatforms.length > 0 &&
    selectedPlatforms.map((p) => <li key={p.name}>{p.name}</li>)}
</ul>

      {/* <p><strong>Selected Sizes:</strong></p> */}
      <ul>
  {selectedSizes && selectedSizes.length > 0 &&
    selectedSizes.map((s) => <li key={s.name}>{s.name}</li>)
  }
</ul>
<ul>
  {selectedUis && selectedUis.length > 0 &&
    selectedUis.map((u) => <li key={u.name}>{u.name}</li>)
  }
</ul>
<ul>
  {selectedUsers && selectedUsers.length > 0 && (
  selectedUsers.map((u) => <li key={u.name}>{u.name}</li>)
)}
</ul>
<ul>
  {selectedGenerators && selectedGenerators.length > 0 &&
    selectedGenerators.map((g) => <li key={g.name}>{g.name}</li>)
  }
</ul>


      <h4>Total Cost: ₹{total}</h4>
    </div>
  );
}

export default Sidebar;
