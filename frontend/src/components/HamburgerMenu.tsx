import { NavLink } from "react-router-dom";
import useAuthStore from "../features/auth/stores/useAuthStore";
import useLogout from "../features/auth/hooks/useLogout";

type HamburgerMenuProps = {
  isHamburgerOpen: boolean;
  isScheduleOpen: boolean;
  toggle: (key: string) => void;
};

const HamburgerMenu = ({
  isHamburgerOpen,
  isScheduleOpen,
  toggle,
}: HamburgerMenuProps) => {
  const { user } = useAuthStore();
  const { logoutUser } = useLogout();

  return (
    <>
      {/* Overlay */}
      {isHamburgerOpen && (
        <div className="fixed inset-0 z-20 bg-black opacity-50"></div>
      )}

      {/* Hamburger Menu */}
      <div
        className={`fixed right-0 top-20 z-20 h-full w-3/4 transform overflow-y-scroll bg-white p-5 font-semibold text-text ${
          isHamburgerOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <ul className="px-5 py-6 text-xl">
          {user && (
            <>
              <p>{user.username}</p>
              <hr className="mb-6 border-2 border-secondary" />
            </>
          )}

          <li className="py-2">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "border-l-4 border-solid border-accent px-2" : ""
              }
            >
              About
            </NavLink>
          </li>
          <li
            className="flex items-center py-2"
            onClick={() => toggle("isScheduleOpen")}
          >
            <NavLink to="/events">Events</NavLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`ml-auto w-7 pl-2 ${
                isScheduleOpen ? "rotate-90" : ""
              } transition-transform duration-100`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </li>
          {isScheduleOpen && (
            <>
              <li className="ml-5 p-1">
                <NavLink
                  to="/schedule"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Schedule
                </NavLink>
              </li>
              <li className="ml-5 p-1">
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Blogs
                </NavLink>
              </li>
            </>
          )}
          <li className="py-2">
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive ? "border-l-4 border-solid border-accent px-2" : ""
              }
            >
              Menu
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                isActive ? "border-l-4 border-solid border-accent px-2" : ""
              }
            >
              Contacts
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink
              to="/my-account"
              className={({ isActive }) =>
                isActive ? "border-l-4 border-solid border-accent px-2" : ""
              }
            >
              Account
            </NavLink>
          </li>

          {user && user.role === "admin" && (
            <>
              <h3 className="mt-10">ADMIN PANEL</h3>
              <hr className="mb-6 border-2 border-secondary" />
              <li className="py-2">
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="py-2">
                <NavLink
                  to="/manage-users"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Manage Users
                </NavLink>
              </li>
              <li className="py-2">
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Reports
                </NavLink>
              </li>
              <li className="py-2">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive ? "border-l-4 border-solid border-accent px-2" : ""
                  }
                >
                  Settings
                </NavLink>
              </li>
            </>
          )}

          <hr className="border-t-3 my-5 border-gray-300" />

          {user && (
            <li
              onClick={logoutUser}
              className="mb-16 whitespace-nowrap border border-red-700 p-1 text-center text-[15px] text-red-800 hover:scale-105 hover:cursor-pointer active:scale-110"
            >
              LOG OUT
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default HamburgerMenu;
