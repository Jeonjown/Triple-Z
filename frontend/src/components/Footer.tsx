import { Link, useLocation } from "react-router-dom";
import { FaMeta, FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  const location = useLocation();

  // If we're on the admin-chat page, do not render the footer.
  if (location.pathname === "/admin-chat") {
    return null;
  }

  return (
    <footer className="relative z-20 mt-auto flex justify-center bg-[#2E2522] p-4 text-white">
      <div className="text-center">
        <ul className="m-4 flex justify-center space-x-5 text-sm md:text-base">
          <li>
            <Link to={"/about"}>ABOUT</Link>
          </li>
          <li>
            <Link to={"/events"}>EVENTS</Link>
          </li>
          <li>
            <Link to={"/menu"}>MENU</Link>
          </li>
          <li>
            <Link to={"/contacts"}>CONTACTS</Link>
          </li>
        </ul>
        <hr className="mx-3" />
        <p className="w-fit px-2 pt-3 text-sm font-extralight">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quisquam
          deserunt modi! Hic quod veritatis neque, harum dicta reiciendis quia
          excepturi repudiandae quas placeat aliquid velit amet ipsum esse
          molestiae?
        </p>
        <div className="h-13 mr-4 flex justify-center space-x-4 py-5">
          <FaMeta size={24} />
          <FaXTwitter size={24} />
          <SiGmail size={24} />
          <AiFillInstagram size={24} />
        </div>
        <p className="text-sm">&copy; 2024 Triple Z. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
