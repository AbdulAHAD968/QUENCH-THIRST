import React from "react";
import waterImage from "./water.jpg";
import waterImage1 from "./water1.webp";
import "./AvailableItems.css";

const AvailableItems = () => {
  // Sample data for available items
  const items = [
    {
      id: 1,
      name: "Mineral Water",
      image: waterImage1, // Use the imported image
      price: "$1.50",
      quantity: "1L",
    },
    {
      id: 2,
      name: "Sparkling Water",
      image: waterImage, // Use the imported image
      price: "$2.00",
      quantity: "500ml",
    },
    {
      id: 3,
      name: "Spring Water",
      image: waterImage1, // Use the imported image
      price: "$3.00",
      quantity: "2L",
    },
    {
      id: 4,
      name: "Alkaline Water",
      image: waterImage, // Use the imported image
      price: "$2.50",
      quantity: "1.5L",
    },
    {
        id: 5,
        name: "Nala Water",
        image: waterImage1, // Use the imported image
        price: "$5.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Rain Water",
        image: waterImage, // Use the imported image
        price: "$0.50",
        quantity: "3L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage1, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage1, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage1, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
    {
        id: 1,
        name: "Mineral Water",
        image: waterImage, // Use the imported image
        price: "$1.50",
        quantity: "1L",
    },
  ];

  return (
    <div className="available-items">
      <h1>Available Items</h1>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>{item.quantity}</p>
            </div>
            <div className="item-footer">
              <span className="item-price">{item.price}</span>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableItems;