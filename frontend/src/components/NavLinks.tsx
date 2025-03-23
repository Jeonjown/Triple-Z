import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react"; // Import the Lucide dropdown icon

const NavLinks = () => {
  return (
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
          {/* The trigger now includes the dropdown icon */}
          <DropdownMenuTrigger className="inline-flex items-center hover:font-bold">
            EVENTS
            <ChevronDown className="ml-1 h-4 w-4" /> {/* Lucide icon */}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-2 max-h-60 overflow-auto">
            <NavLink to="/schedule" className="font-semibold">
              <DropdownMenuItem className="hover:cursor-pointer">
                Make a Schedule
              </DropdownMenuItem>
            </NavLink>
            <NavLink to="/blogs" className="font-semibold">
              <DropdownMenuItem className="hover:cursor-pointer">
                Blogs
              </DropdownMenuItem>
            </NavLink>
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
  );
};

export default NavLinks;
