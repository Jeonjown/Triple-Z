import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaBell } from "react-icons/fa";

const NotificationIcon = () => {
  return (
    <>
      <div className="relative ml-auto gap-2 md:flex">
        {/* notification icon */}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <FaBell size={28} className="text-icon hover:scale-105" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuLabel className="font-bold">
              NOTIFICATION
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              Your notification message goes here!
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default NotificationIcon;
