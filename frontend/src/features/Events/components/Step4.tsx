import { Link } from "react-router-dom";

// Step 4: Final Thank You Screen
const Step4 = () => (
  <>
    <div className="mt-5 flex justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-green-700"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>
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

export default Step4;
