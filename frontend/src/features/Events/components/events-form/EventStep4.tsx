// src/components/events-form/EventStep4.tsx

import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

// Define the props interface
interface EventStep4Props {
  paymentLink: string | null;
}

// Step 4: Final Thank You Screen
// Accept paymentLink as a prop
const EventStep4 = ({ paymentLink }: EventStep4Props) => (
  <>
    <h2 className="mb-4 text-center font-heading text-4xl">
      {" "}
      {/* Added consistent heading style */}
      Thank you for your reservation!
    </h2>
    <div className="mt-5 flex justify-center">
      <CircleCheckBig className="!size-40 text-green-400" />
    </div>
    <p className="mt-5 text-center text-lg">
      Your booking is currently <span className="font-semibold">pending</span>{" "}
      and will be reviewed by our team. You'll receive a confirmation once it
      has been approved by the Triple Z.
    </p>

    {/* Conditionally display the payment link if it exists */}
    {paymentLink && (
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-primary">
          Complete Your Online Payment:
        </p>
        <a
          href={paymentLink}
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security best practice for target="_blank"
          className="mt-2 inline-block break-all text-blue-600 underline hover:text-blue-800" // Added break-all for long links
        >
          {paymentLink}
        </a>
        <p className="mt-1 text-sm text-muted-foreground">
          Please use the link above to complete your online payment.
        </p>
      </div>
    )}

    {/* Add instructions for Cash payment if needed */}
    {!paymentLink && (
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-primary">
          Payment Method: Cash
        </p>
        <p className="mt-2 text-base text-muted-foreground">
          Please settle your payment in cash upon arrival or according to the
          terms you've agreed upon.
        </p>
      </div>
    )}

    <p className="mt-10 text-center">
      You can view or modify your reservation in
    </p>
    <Link to="/profile" replace>
      <p className="text-center font-semibold underline">My Account.</p>
    </Link>
    {/* Optional: Add a button or link to return home */}
    <div className="mt-6 text-center">
      <Link to="/" className="text-primary underline hover:no-underline">
        Return to Homepage
      </Link>
    </div>

    {/* Go to Contacts link */}
    <Link to="/contacts" replace>
      <div className="mt-6 flex items-center justify-center gap-3">
        {" "}
        {/* Adjusted margin */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-center font-semibold underline">Contact Us</p>{" "}
        {/* Changed text slightly */}
      </div>
    </Link>
  </>
);

export default EventStep4;
