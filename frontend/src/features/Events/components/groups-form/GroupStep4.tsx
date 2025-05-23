import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

// Step 4: Final Thank You Screen
const GroupStep4 = () => (
  <>
    <div className="mt-5 flex justify-center">
      <CircleCheckBig className="!size-40 text-green-400" />
    </div>
    <p className="mt-5 text-center text-lg">
      Your booking is currently <span className="font-semibold">pending</span>{" "}
      and will be reviewed by our team. You'll receive a confirmation once it
      has been approved by the Triple Z.
    </p>
    <p className="mt-10 text-center">
      You can view or modify your reservation in
    </p>
    <Link to="/profile" replace>
      <p className="text-center font-semibold underline">My Account.</p>
    </Link>
    <Link to="/contacts" replace>
      <div className="mt-10 flex items-center justify-center gap-3">
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
        <p className="text-center font-semibold underline">Go to Contacts</p>
      </div>
    </Link>
  </>
);

export default GroupStep4;
