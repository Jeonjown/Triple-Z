import { Link } from "react-router-dom";
import useLogout from "../features/auth/hooks/useLogout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaUserCircle } from "react-icons/fa";

const ProfileIcon = () => {
  const { logoutUser } = useLogout();

  return (
    <>
      <div className="relative ml-auto hidden gap-2 md:flex">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <FaUserCircle size={32} className="text-icon hover:scale-105" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={"/my-account"}>My Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ProfileIcon;
