import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

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
        <IoMdClose
          size={45}
          onClick={() => toggle("isHamburgerOpen")}
          className="z-50 rounded-full p-2 text-icon hover:cursor-pointer hover:bg-muted active:animate-rotateLeftSlowly"
        />
      ) : (
        // burger icon
        <RxHamburgerMenu
          size={45}
          onClick={() => toggle("isHamburgerOpen")}
          className="z-50 rounded-full p-2 text-icon hover:cursor-pointer hover:bg-muted active:animate-rotateRightSlowly sm:hidden"
        />
      )}
    </>
  );
};

export default HamburgerIcon;
