import { Link } from "react-router-dom";
import usePopUpControl from "../hooks/usePopUpControl";

const ProfileIcon = () => {
  const { togglePopUpVisibility, isPopUpVisible, iconRef, popUpRef } =
    usePopUpControl();
  return (
    <>
      <div className="relative ml-auto flex gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden w-9 hover:cursor-pointer sm:block"
          onClick={togglePopUpVisibility}
          ref={iconRef}
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
        {isPopUpVisible && (
          <div
            ref={popUpRef}
            className="absolute right-0 top-full z-10 mt-2 w-max rounded-md bg-primary p-4 shadow-lg"
          >
            <div className="absolute left-[132px] top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-b-[10px] border-l-[10px] border-r-[10px] border-t-0 border-transparent border-b-black"></div>
            <Link to={"/my-account"}>
              <div className="ml-5 p-1">My Account</div>
            </Link>
            <button className="ml-5 p-1">Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileIcon;
