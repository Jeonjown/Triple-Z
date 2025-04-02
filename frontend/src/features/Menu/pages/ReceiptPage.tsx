import React, { useEffect, useState } from "react";

const ReceiptPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");

    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        const jsonData = JSON.parse(decodedData);
        setOrderData(jsonData);
      } catch (err) {
        setError("Invalid JSON data.");
      }
    }
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!orderData) return <div>Loading receipt...</div>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Customer Receipt</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orderData.map((item, index) => (
          <li key={index} style={{ marginBottom: "15px" }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "100px", height: "100psx", borderRadius: "8px" }}
            />
            <div>
              <strong>{item.title}</strong> - {item.size}
            </div>
            <div>
              Qty: {item.quantity} - Price: ${item.price}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiptPage;
