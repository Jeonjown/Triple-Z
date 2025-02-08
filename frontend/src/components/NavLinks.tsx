import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavLinks = () => {
  return (
    <>
      <ul className="hidden w-4/5 sm:ml-3 sm:flex sm:justify-center sm:gap-5 md:gap-7 md:text-xl">
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-solid border-primary p-1"
                : "p-1 hover:font-bold"
            }
          >
            ABOUT
          </NavLink>
        </li>

        <li className="block">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="inline-flex items-center hover:font-bold">
              EVENTS
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-2 max-h-60 overflow-auto">
              <DropdownMenuItem>
                <NavLink to={"/schedule"} className={"font-semibold"}>
                  Make a Schedule
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NavLink to={"/blogs"} className={"font-semibold"}>
                  Blogs
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-solid border-primary p-1"
                : "p-1 hover:font-bold"
            }
          >
            MENU
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-solid border-primary p-1"
                : "p-1 hover:font-bold"
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
