import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import PlatformSelection from "./components/PlatformSelection";
import UiSelection from "./components/UiSelection";
import SizeSelection from "./components/SizeSelection";
import UserSelection from "./components/UserSelection";
import UsersAndGenerated from "./components/UsersAndGenreated";

function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedUis, setSelectedUis] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGenerators, setSelectedGenerators] = useState([]); // added state

  return (
    <div className="container">
      <h1 className="heading">HOW MUCH TO MAKE AN APP OR WEB?</h1>

      {/* Platform Selection */}
      <PlatformSelection
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
      />

      {/* Size Selection */}
      <SizeSelection
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
      />

      {/* UI Selection */}
      <UiSelection
        selectedUis={selectedUis}
        setSelectedUis={setSelectedUis}
      />

      {/* User Selection */}
      <UserSelection
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />

      {/* Users and Generators */}
      <UsersAndGenerated
        selectedGenerators={selectedGenerators}
        setSelectedGenerators={setSelectedGenerators}
      />

      {/* Sidebar */}
      <Sidebar
        selectedPlatforms={selectedPlatforms}
        selectedSizes={selectedSizes}
        selectedUis={selectedUis}
        selectedUsers={selectedUsers}
        selectedGenerators={selectedGenerators}
      />
    </div>
  );
}

export default App;
