import React, { useEffect, useState } from "react";
import LZString from "lz-string";

const ReceiptPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");

    if (dataParam) {
      try {
        const decodedData =
          LZString.decompressFromEncodedURIComponent(dataParam);
        const jsonData = JSON.parse(decodedData);
        setOrderData(jsonData);
      } catch (err) {
        setError("Invalid JSON data.");
      }
    }
  }, []);

  if (error) return <div className="py-4 text-center">Error: {error}</div>;
  if (!orderData)
    return <div className="py-4 text-center">Loading receipt...</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-lg rounded-lg border bg-white p-6 shadow-md">
        {" "}
        {/* Changed max-w-md to max-w-lg */}
        <h2 className="mb-4 text-center text-xl font-semibold">
          Customer Receipt
        </h2>
        <ul className="list-none p-0">
          {orderData.map((item, index) => (
            <li
              key={index}
              className="mb-4 flex items-center border-b pb-4 last:border-b-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="mr-4 h-20 w-20 rounded object-cover"
              />
              <div className="flex-grow">
                <div className="text-sm font-semibold">{item.title}</div>
                {item.size && (
                  <div className="text-xs text-gray-600">{item.size}</div>
                )}
                <div className="text-xs text-gray-700">
                  Qty: {item.quantity} - Price: ₱{item.price.toFixed(2)}
                </div>
              </div>
              <div className="ml-2 text-sm font-semibold text-gray-800">
                ₱{(item.quantity * item.price).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-4 text-right font-semibold">
          Total: ₱
          {orderData
            .reduce((total, item) => total + item.quantity * item.price, 0)
            .toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
