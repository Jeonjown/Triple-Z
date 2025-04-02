import { useCartStore } from "../stores/useCartStore";
import { QRCodeCanvas } from "qrcode.react";

const GenerateReceipt = () => {
  const { cart } = useCartStore();

  if (!cart || cart.length === 0) return <p>No items in cart.</p>;

  const encodedData = encodeURIComponent(JSON.stringify(cart));
  const qrUrl = `${import.meta.env.VITE_FRONTEND_URL}/menu/receipt-page?data=${encodedData}`;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Scan QR Code to View Receipt</h2>
      <QRCodeCanvas value={qrUrl} size={200} />
      <p>{qrUrl}</p> {/* Optional: Show URL for debugging */}
    </div>
  );
};

export default GenerateReceipt;
