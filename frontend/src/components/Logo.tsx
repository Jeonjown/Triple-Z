import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <>
      <Link to={"/"}>
        <img src="/triple-z-logo.png" alt="logo" className="w-12 lg:w-14" />
      </Link>
    </>
  );
};

export default Logo;
