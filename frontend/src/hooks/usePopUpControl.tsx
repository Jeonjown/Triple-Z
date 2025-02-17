import { useEffect, useRef, useState } from "react";

const usePopUpControl = () => {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const iconRef = useRef<SVGSVGElement | null>(null);
  const popUpRef = useRef<null | HTMLDivElement>(null);

  // Function to handle outside clicks
  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // If the click is outside of the icon or popup, close the popup
    if (
      iconRef.current &&
      !iconRef.current.contains(target) &&
      popUpRef.current &&
      !popUpRef.current.contains(target)
    ) {
      setIsPopUpVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const togglePopUpVisibility = () => {
    setIsPopUpVisible((prevState) => !prevState);
  };

  return {
    togglePopUpVisibility,
    isPopUpVisible,
    iconRef,
    popUpRef,
  };
};

export default usePopUpControl;
