import usePopUpControl from "../hooks/usePopUpControl";

const NotificationIcon = () => {
  const { togglePopUpVisibility, isPopUpVisible, iconRef, popUpRef } =
    usePopUpControl();

  return (
    <>
      <div className="relative ml-auto flex gap-2 hover:scale-105 active:scale-110">
        {/* notification icon */}
        <svg
          ref={iconRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative w-8 hover:cursor-pointer"
          onClick={togglePopUpVisibility}
        >
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            clipRule="evenodd"
          />
        </svg>

        {isPopUpVisible && (
          <div
            ref={popUpRef}
            className="absolute left-[-80px] top-full z-10 mt-2 w-max -translate-x-1/2 rounded-md bg-primary p-4 shadow-lg"
          >
            <div className="absolute right-[35px] top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-b-[10px] border-l-[10px] border-r-[10px] border-t-0 border-transparent border-b-black"></div>
            <h4 className="font-bold">NOTIFICATION</h4>
            <p className="mt-2 font-light">
              Your notification message goes here!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationIcon;
