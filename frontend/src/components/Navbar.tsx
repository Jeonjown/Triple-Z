import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="flex items-center px-2 py-4 align-middle font-semibold text-text">
        <Link to={"/"}>
          <img src="/triple-z-logo.png" alt="logo" className="flex-3 w-10" />
        </Link>

        <ul className="hidden w-4/5 bg-red-50 sm:ml-3 sm:flex sm:justify-center sm:gap-5">
          <Link to={"/about"}>
            <li>ABOUT</li>
          </Link>
          <Link to={"/events"}>
            <li>EVENTS</li>
          </Link>
          <Link to={"/menu"}>
            <li>MENU</li>
          </Link>
          <Link to={"/contacts"}>
            <li>CONTACTS</li>
          </Link>
        </ul>

        <div className="ml-auto flex gap-2">
          {/* bell icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="hidden w-7 sm:block"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
              clipRule="evenodd"
            />
          </svg>

          {/* notif icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 sm:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
