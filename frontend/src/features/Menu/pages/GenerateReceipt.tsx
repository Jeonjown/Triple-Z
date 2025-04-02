import { useCartStore } from "../stores/useCartStore";
import { QRCodeSVG } from "qrcode.react"; // Revert to QRCodeSVG
import LZString from "lz-string";
import { Copy } from "lucide-react";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

const GenerateReceipt = () => {
  const { cart } = useCartStore();
  const [copySuccess, setCopySuccess] = useState("");
  const [isDownloading, setIsDownloading] = useState(false); // New state variable
  const receiptRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref for the QR code container
  const [qrCodeSize, setQrCodeSize] = useState(300); // State to manage QR code size

  if (!cart || cart.length === 0)
    return (
      <p className="py-6 text-center text-lg text-gray-600">
        No items in cart.
      </p>
    );

  const encodedData = LZString.compressToEncodedURIComponent(
    JSON.stringify(cart),
  );
  const qrUrl = `${import.meta.env.VITE_FRONTEND_URL}/menu/receipt-page?data=${encodedData}`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopySuccess("Link copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopySuccess("Failed to copy!");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );

  const downloadReceiptImage = () => {
    if (receiptRef.current) {
      setIsDownloading(true);

      const images = receiptRef.current.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${img.src}`));
          if (img.complete) {
            resolve(img);
          }
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          html2canvas(receiptRef.current, { scale: 2 })
            .then((canvas) => {
              const link = document.createElement("a");
              link.download = "receipt.png";
              link.href = canvas.toDataURL("image/png");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            })
            .finally(() => {
              setIsDownloading(false);
            });
        })
        .catch((error) => {
          console.error("Error loading images before download:", error);
          setIsDownloading(false);
          // Optionally display an error message to the user
        });
    }
  };

  const downloadQRCodeAsImage = () => {
    if (qrCodeRef.current) {
      setQrCodeSize(100); // Set the QR code size to 100

      // Wait for the component to re-render with the new size
      setTimeout(() => {
        html2canvas(qrCodeRef.current, { scale: 5 }).then((canvas) => {
          const link = document.createElement("a");
          link.download = "qr_code.png";
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setQrCodeSize(300); // Reset the QR code size after download (optional)
        });
      }, 100); // Small delay to allow re-render
    }
  };

  return (
    <div className="mt-8 flex min-h-screen items-start justify-center p-6 text-center">
      <div
        ref={receiptRef}
        className="w-full max-w-lg rounded-md border bg-white p-8"
      >
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Scan QR Code to View Receipt
        </h2>
        <div
          ref={qrCodeRef}
          className="justify mb-6 flex items-center justify-center p-5"
        >
          <QRCodeSVG value={qrUrl} size={qrCodeSize} />{" "}
          {/* Use the state for size */}
        </div>

        {!isDownloading && (
          <div className="mb-6 space-x-2">
            <Button
              onClick={handleCopyToClipboard}
              className="items mx-auto mb-2 flex"
              variant={"secondary"}
            >
              Copy Link <Copy size={16} />
            </Button>
            <Button onClick={downloadReceiptImage}>Download as Image</Button>
            <Button
              onClick={downloadQRCodeAsImage}
              className=""
              variant={"secondary"}
            >
              Download QR Image
            </Button>
            {copySuccess && (
              <p
                className={`mt-2 text-sm ${copySuccess === "Link copied!" ? "text-green-500" : "text-red-500"}`}
              >
                {copySuccess}
              </p>
            )}
          </div>
        )}

        <div className="mx-auto w-full border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Order Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2 text-gray-600">Item</th>
                  <th className="py-2 text-gray-600">Qty</th>
                  <th className="py-2 text-right text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3 text-right">
                      ₱{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total:</span>
              <span>₱{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReceipt;
