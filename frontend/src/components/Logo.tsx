import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <>
      <Link to={"/"}>
        <img
          src="/triple-z-logo.svg"
          alt="logo"
          className="ml-2 w-16 min-w-[3.5rem]"
        />
      </Link>
    </>
  );
};

export default Logo;
