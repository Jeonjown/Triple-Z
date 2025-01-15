import { NavLink } from "react-router-dom";

const NavLinks = () => {
  return (
    <>
      <ul className="hidden w-4/5 sm:ml-3 sm:flex sm:justify-center sm:gap-5 md:gap-7 md:text-xl">
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-solid border-accent p-1" : "p-1"
            }
          >
            ABOUT
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-solid border-accent p-1" : "p-1"
            }
          >
            EVENTS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-solid border-accent p-1" : "p-1"
            }
          >
            SCHEDULE
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-solid border-accent p-1" : "p-1"
            }
          >
            MENU
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-solid border-accent p-1" : "p-1"
            }
          >
            CONTACTS
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default NavLinks;
