import React from "react";
import Subscription from "../assets/Subscription.png";
import Market from "../assets/Marketplace.png";
import Product from "../assets/Product.png";
import Shopping from "../assets/ShoppingCart.png";
import Payment from "../assets/Payment.png";

// Data for Billing & eCommerce
const Billings = [
  { name: "Subscription", price: 12000, image: Subscription },
  { name: "User Marketplace", price: 15000, image: Market },
  { name: "Product", price: 10000, image: Product },
  { name: "Shopping Cart", price: 10000, image: Shopping },
  { name: "Payment", price: 10000, image: Payment },
];

function BillingAndEcommerce({ selectedBilling, setSelectedBilling, selectedPlatforms }) {
  const toggleBilling = (bill) => {
    if (!selectedPlatforms || selectedPlatforms.length === 0) return; // prevent selection if no platform

    const exists = selectedBilling.some((b) => b.name === bill.name);
    if (exists) {
      setSelectedBilling(selectedBilling.filter((b) => b.name !== bill.name));
    } else {
      setSelectedBilling([...selectedBilling, bill]);
    }
  };

  const isDisabled = !selectedPlatforms || selectedPlatforms.length === 0;

  return (
    <div className="platform-section">
      <h2 className="sub">8. Billing & eCommerce</h2>
      <div className="platform-list">
        {Billings.map((bill) => {
          const isSelected = selectedBilling.some((b) => b.name === bill.name);

          return (
            <div
              key={bill.name}
              className={`platform-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              onClick={() => toggleBilling(bill)}
              style={{
                 pointerEvents: isDisabled ? "none" : "auto",
                cursor: isDisabled ? "default" : "pointer",
                opacity: isDisabled ? 1 : 1,
              }}
            >
              <img src={bill.image} alt={bill.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{bill.name}</p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BillingAndEcommerce;
