"use client"

import React, { useState, useEffect } from "react";
import "./checkout.css";
import { IndianRupee } from "lucide-react";

interface MessageProps {
  message: string;
}

const ProductDisplay: React.FC = () => (
  <section>
    <div className="product">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="CampusConnect"
      />
      <div className="description">
        <h1 className="text-xl text-black">Subscribe to CampusConnect</h1>
        <h5 className="flex text-xl items-center">{<IndianRupee className="text-lg" />} 1200</h5>
      </div>
    </div>
    <form action="api/create-checkout-session" method="POST">
      <button type="submit">Subscribe?</button>
    </form>
  </section>
);

// Message component
const Message: React.FC<MessageProps> = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

// Main App component
const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
};

export default App;
