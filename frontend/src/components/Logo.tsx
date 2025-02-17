import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <>
      <Link to={"/"}>
        <img
          src="/triple-z-logo.png"
          alt="logo"
          className="w-14 min-w-[3.5rem]"
        />
      </Link>
    </>
  );
};

export default Logo;
