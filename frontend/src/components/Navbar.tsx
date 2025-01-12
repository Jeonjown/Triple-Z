import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import NavLinks from "./NavLinks";
import HamburgerIcon from "./HamburgerIcon";
import HamburgerMenu from "./HamburgerMenu";

import useToggle from "../hooks/useToggle";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/api/auth";
import useAuthStore from "../features/auth/stores/useAuthStore";

const Navbar = () => {
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();

  const { toggleState, toggle } = useToggle({
    isHamburgerOpen: false,
    isScheduleOpen: false,
    isAccountOpen: false,
  });

  const handleLogout = () => {
    logout();
    logoutStore();
  };

  return (
    <>
      <nav className="relative z-50 flex items-center border-2 bg-white px-6 py-4 align-middle font-semibold text-text shadow md:px-6 md:py-6">
        <Logo />
        <NavLinks />

        <div className="relative ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="mr-1 h-9 whitespace-nowrap border-[1px] border-accent px-6 text-[15px] hover:scale-105 hover:cursor-pointer active:scale-110"
              >
                LOG OUT
              </button>
              <p>{user?.username}</p>
            </>
          ) : (
            <>
              <button className="mr-1 h-9 whitespace-nowrap px-2 text-[15px] hover:scale-105 hover:cursor-pointer active:scale-110">
                <Link to={"/signup"}>SIGN UP</Link>
              </button>
              <button className="mr-1 h-9 whitespace-nowrap border-[1px] border-accent px-6 text-[15px] hover:scale-105 hover:cursor-pointer active:scale-110">
                <Link to={"/login"}> LOG IN</Link>
              </button>{" "}
            </>
          )}

          <NotificationIcon />
          <ProfileIcon />
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
