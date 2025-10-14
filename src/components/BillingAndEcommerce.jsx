import React from "react";
import Subscription from "../assets/Subscription.png";
import Market from "../assets/MarketPlace.png";
import Product from "../assets/Product.png";
import Shopping from "../assets/Shopping Cart.jpg";
import Payment from "../assets/Payment.png";
// Data for social & engagement options
const Billings = [
  { name: "Subscription", price: 12000, image: Subscription },
  { name: "User Marketplace", price: 15000, image: Market },
  { name: "Product", price: 10000, image: Product},
  { name: "Shopping Cart", price: 10000, image: Shopping },
  { name: "Payment", price: 10000, image: Payment },

];

function BillingAndEcommerce({ selectedBilling, setSelectedBilling }) {
  const toggleBilling = (bill) => {
    const exists = selectedBilling.some((b) => b.name ===bill.name);

    if (exists) {
      // remove from selection
     setSelectedBilling(
        selectedBilling.filter((b) => b.name !== bill.name)
      );
    } else {
      // add to selection
     setSelectedBilling([... selectedBilling, bill]);
    }
  };

  return (
    <div className="platform-section">
      <h2 className="title">8. Billing & eCommerce</h2>
      <div className="platform-list">
        {Billings.map((bill) => {
          const isSelected = selectedBilling.some(
            (b) => b.name === bill.name
          );
          return (
            <div
              key={bill.name}
              className={`platform-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleBilling(bill)}
            >
              <img src={bill.image} alt={bill.name} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {bill.name}
              </p>
              {isSelected && <div className="tick-mark">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BillingAndEcommerce;
