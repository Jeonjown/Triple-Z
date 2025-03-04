import { useEffect } from "react";

const DisableScroll = () => {
  useEffect(() => {
    // Disable scroll by setting overflow to hidden
    document.body.style.overflow = "hidden";

    // Cleanup function to re-enable scroll when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return null;
};

export default DisableScroll;
