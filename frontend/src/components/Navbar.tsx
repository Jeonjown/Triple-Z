import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import NavLinks from "./NavLinks";
import HamburgerIcon from "./HamburgerIcon";
import HamburgerMenu from "./HamburgerMenu";
import useToggle from "../hooks/useToggle";
import { Link } from "react-router-dom";
import useAuthStore from "../features/auth/stores/useAuthStore";
import useFetchUserData from "../features/auth/hooks/useFetchUserData";
import { Button } from "./ui/button";
import { RiShoppingBag3Fill } from "react-icons/ri";

const Navbar = () => {
  const { user } = useFetchUserData();
  const { isAuthenticated } = useAuthStore();

  const { toggleState, toggle } = useToggle({
    isHamburgerOpen: false,
    isScheduleOpen: false,
    isAccountOpen: false,
  });

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-24 w-full items-center bg-white px-6 font-semibold text-text shadow md:px-6 md:py-6">
        <Logo />
        <NavLinks />

        <div className="relative ml-auto flex items-center gap-2">
          {!isAuthenticated && (
            <>
              <Button asChild size={"lg"} variant="ghost">
                <Link to={"/signup"}>SIGN UP</Link>
              </Button>
              <Button asChild size={"lg"} variant={"outline"}>
                <Link to={"/login"}>LOG IN</Link>
              </Button>
            </>
          )}

          {user && <div className="hidden lg:block">{user.username}</div>}

          {user && (
            <>
              <RiShoppingBag3Fill className="!size-8 hover:scale-105 hover:cursor-pointer" />
              <NotificationIcon />
              <ProfileIcon />
            </>
          )}

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
        toggle={toggle}
      />
    </>
  );
};

export default Navbar;
