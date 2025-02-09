import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { Button } from "./ui/button";

type HamburgerIconProps = {
  isHamburgerOpen: boolean;
  isScheduleOpen: boolean;
  isAccountOpen: boolean;
  toggle: (key: string) => void;
};

const HamburgerIcon = ({ isHamburgerOpen, toggle }: HamburgerIconProps) => {
  return (
    <>
      {isHamburgerOpen ? (
        // x icon

        <Button
          className="z-50 h-10 rounded-full hover:cursor-pointer hover:bg-muted active:animate-rotateLeftSlowly"
          onClick={() => toggle("isHamburgerOpen")}
          size={"icon"}
          variant={"ghost"}
        >
          <IoMdClose className="!size-7" />
        </Button>
      ) : (
        // burger icon
        <Button
          onClick={() => toggle("isHamburgerOpen")}
          className="z-50 rounded-full p-2 text-icon hover:cursor-pointer hover:bg-muted active:animate-rotateRightSlowly sm:hidden"
          size={"icon"}
          variant={"ghost"}
        >
          <RxHamburgerMenu className="!size-7" />
        </Button>
      )}
    </>
  );
};

export default HamburgerIcon;
