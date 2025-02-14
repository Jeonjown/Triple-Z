import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const smoothScrollToTop = () => {
  const scrollStep = -window.scrollY / 15; // Controls speed
  const scrollAnimation = () => {
    if (window.scrollY > 0) {
      window.scrollBy(0, scrollStep);
      requestAnimationFrame(scrollAnimation);
    }
  };
  requestAnimationFrame(scrollAnimation);
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    smoothScrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
