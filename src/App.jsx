import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import PlatformSelection from "./components/PlatformSelection";
import UiSelection from "./components/UiSelection";
import SizeSelection from "./components/SizeSelection";
import UserSelection from "./components/UserSelection";
import UsersAndGenerated from "./components/UsersAndGenreated";
import DatesAndLocation from "./components/DatesAndLocation";
import  SocialAndEngagement from "./components/SocialAndEngagement";
import BillingAndEcommerce from "./components/BillingAndEcommerce";
import AdminFeedback from "./components/AdminFeedback";
function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedUis, setSelectedUis] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGenerators, setSelectedGenerators] = useState([]);
  const [selectedDates, setSelectedDates]=useState([]);
  const [selectedEngagement,setSelectedEngagement]=useState([]);
  const [selectedBilling,setSelectedBilling]=useState([]);
  const [selectedAdmins,setSelectedAdmins]=useState([]);
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
      <DatesAndLocation
      selectedDates={selectedDates}
      setSelectedDates={setSelectedDates}
      />
      <SocialAndEngagement
      selectedEngagement={selectedEngagement}
      setSelectedEngagement={setSelectedEngagement}/>
      <BillingAndEcommerce
      selectedBilling={selectedBilling}
      setSelectedBilling={setSelectedBilling}
      />
      < AdminFeedback
      selectedAdmins={selectedAdmins}
      setSelectedAdmins={setSelectedAdmins}
      />
        {/* Sidebar */}
      <Sidebar
        selectedPlatforms={selectedPlatforms}
        selectedSizes={selectedSizes}
        selectedUis={selectedUis}
        selectedUsers={selectedUsers}
        selectedGenerators={selectedGenerators}
        selectedDates={selectedDates}
        selectedEngagement={selectedEngagement}
        selectedBilling={selectedBilling}
        selectedAdmins={selectedAdmins}
      />
    </div>
  );
}

export default App;
