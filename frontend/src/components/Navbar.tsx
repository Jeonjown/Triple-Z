import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import NavLinks from "./NavLinks";
import HamburgerIcon from "./HamburgerIcon";
import HamburgerMenu from "./HamburgerMenu";

import useToggle from "../hooks/useToggle";

const Navbar = () => {
  const { toggleState, toggle } = useToggle({
    isProfileOpen: false,
    isHamburgerOpen: false,
    isScheduleOpen: false,
    isAccountOpen: false,
  });

  return (
    <>
      <nav className="relative z-50 flex items-center border-2 bg-white px-6 py-4 align-middle font-semibold text-text shadow md:px-6 md:py-6">
        <Logo />
        <NavLinks />
        <div className="relative ml-auto flex gap-2">
          <NotificationIcon />
          <ProfileIcon
            isProfileOpen={toggleState.isProfileOpen}
            toggle={toggle}
          />
          <HamburgerIcon
            isHamburgerOpen={toggleState.isHamburgerOpen}
            isScheduleOpen={toggleState.isScheduleOpen}
            isAccountOpen={toggleState.isAccountOpen}
            toggle={toggle}
          />
        </div>
      </nav>
      <HamburgerMenu
        isHamburgerOpen={toggleState.isHamburgerOpen}
        isScheduleOpen={toggleState.isScheduleOpen}
        isAccountOpen={toggleState.isAccountOpen}
        toggle={toggle}
      />
    </>
  );
};

export default Navbar;
