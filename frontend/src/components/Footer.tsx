import { Link, useLocation } from "react-router-dom";
import { FaMeta, FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  const location = useLocation();

  // If the path starts with "/admin", do not render the footer.
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative z-20 mt-auto flex justify-center bg-[#2E2522] p-4 text-white">
      <div className="text-center">
        <ul className="m-4 flex justify-center space-x-5 text-sm md:text-base">
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/events">EVENTS</Link>
          </li>
          <li>
            <Link to="/menu">MENU</Link>
          </li>
          <li>
            <Link to="/contacts">CONTACTS</Link>
          </li>
        </ul>
        <hr className="mx-3" />
        <p className="w-fit px-2 pt-3 text-sm font-extralight">
          Triple Z Coffeeshop is an open rooftop café that is located at the
          heart of Baranggay Palingon Tipas. The Business Owners intended to
          provide the local residents of the Baranggay and its nearby community
          an alternative hang out place with a new taste of variety of foods
          that are not common to the culture of the city
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
