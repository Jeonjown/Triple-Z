import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isHamburgerOn, setIsHamburgerOn] = useState(false);
  const [scheduleToggle, setScheduleToggle] = useState(false);
  const [accountToggle, setAccountToggle] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const [activeLink, setActiveLink] = useState("about");
  return (
    <>
      <nav className="relative z-50 flex items-center border-2 bg-white px-6 py-4 align-middle font-semibold text-text shadow md:px-6 md:py-6">
        <Link to={"/"}>
          <img src="/triple-z-logo.png" alt="logo" className="w-12 lg:w-14" />
        </Link>

        <ul className="hidden w-4/5 sm:ml-3 sm:flex sm:justify-center sm:gap-5 md:gap-7 md:text-xl">
          <Link to={"/about"}>
            <li
              className={
                activeLink === "about"
                  ? "border-b-2 border-solid border-accent"
                  : undefined
              }
              onClick={() => setActiveLink("about")}
            >
              ABOUT
            </li>
          </Link>
          <Link to={"/events"}>
            <li
              className={
                activeLink === "events"
                  ? "border-b-2 border-solid border-accent"
                  : undefined
              }
              onClick={() => setActiveLink("events")}
            >
              EVENTS
            </li>
          </Link>
          <Link to={"/menu"}>
            <li
              className={
                activeLink === "menu"
                  ? "border-b-2 border-solid border-accent"
                  : undefined
              }
              onClick={() => setActiveLink("menu")}
            >
              MENU
            </li>
          </Link>
          <Link to={"/contacts"}>
            <li
              className={
                activeLink === "contacts"
                  ? "border-b-2 border-solid border-accent"
                  : undefined
              }
              onClick={() => setActiveLink("contacts")}
            >
              CONTACTS
            </li>
          </Link>
        </ul>

        <div className="relative ml-auto flex gap-2">
          {/* notification icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative hidden w-8 sm:block"
            onClick={() => setNotificationToggle((prevState) => !prevState)}
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
              clipRule="evenodd"
            />
          </svg>

          {notificationToggle && (
            <div className="absolute left-[-80px] top-full z-10 mt-2 w-max -translate-x-1/2 rounded-md bg-primary p-4 shadow-lg">
              <div className="absolute right-[42px] top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-b-[10px] border-l-[10px] border-r-[10px] border-t-0 border-transparent border-b-primary"></div>
              <p>Your notification message goes here!</p>
            </div>
          )}

          {/* profile icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="hidden w-9 sm:block"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
              onClick={() => setProfileToggle((prevState) => !prevState)}
            />
          </svg>
          {profileToggle && (
            <div className="absolute top-full z-10 mt-2 w-max -translate-x-1/2 rounded-md bg-primary p-4 shadow-lg">
              <div className="absolute left-[13px] top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-b-[10px] border-l-[10px] border-r-[10px] border-t-0 border-transparent border-b-black"></div>
              <Link to={"/my-account"}>
                <div className="ml-5 p-1">My Account</div>
              </Link>
              <button className="ml-5 p-1">Logout</button>
            </div>
          )}

          {isHamburgerOn ? (
            // x icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="active:animate-rotateLeftSlowly z-50 w-12 rounded-full p-2 hover:cursor-pointer hover:bg-primary"
              onClick={() => setIsHamburgerOn((prevState) => !prevState)}
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // burger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="active:animate-rotateRightSlowly z-50 w-12 rounded-full p-2 hover:cursor-pointer hover:bg-primary sm:hidden"
              onClick={() => setIsHamburgerOn((prevState) => !prevState)}
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </nav>
      {/* overlay */}
      {isHamburgerOn && (
        <div className="fixed inset-0 z-10 bg-black opacity-50"></div>
      )}

      {/* burger menu */}
      {
        <div
          className={`fixed right-0 top-20 z-20 h-full w-3/4 transform bg-white p-5 font-semibold text-text ${isHamburgerOn ? "translate-x-0" : "translate-x-full"} delay-250 transition-transform duration-300 ease-in`}
        >
          <ul className="px-5 py-6 text-xl">
            <Link to={"/about"}>
              <li className="py-2">ABOUT</li>
            </Link>
            <Link to={"/events"}>
              <li
                className="flex items-center py-2"
                onClick={() => setScheduleToggle((prevState) => !prevState)}
              >
                EVENTS
                {/* Event dropdown icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`ml-auto w-7 pl-2 ${scheduleToggle && "rotate-90 duration-100"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </li>
              {scheduleToggle && (
                <>
                  <Link to={"/schedule"}>
                    <li className="ml-5 p-1">Schedule</li>
                  </Link>
                  <Link to={"/blogs"}>
                    <li className="ml-5 p-1">Blogs</li>
                  </Link>
                </>
              )}
            </Link>
            <Link to={"/menu"}>
              <li className="py-2">MENU</li>
            </Link>
            <Link to={"/contacts"}>
              <li className="py-2">CONTACTS</li>
            </Link>
            <hr className="border-t-3 my-10 border-gray-300" />
            <Link to={"/contacts"}>
              <li
                className="flex items-center py-2"
                onClick={() => setAccountToggle((prevState) => !prevState)}
              >
                ACCOUNT
                {/* Event dropdown icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`ml-auto w-7 pl-2 ${accountToggle && "rotate-90 duration-100"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </li>
            </Link>
            {accountToggle && (
              <>
                <Link to={"/my-account"}>
                  <li className="ml-5 p-1">My Account</li>
                </Link>
                <button className="ml-5 p-1">Logout</button>
              </>
            )}
          </ul>
        </div>
      }
    </>
  );
};

export default Navbar;
