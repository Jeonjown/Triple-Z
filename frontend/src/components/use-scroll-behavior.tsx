import { useEffect } from "react";

function useScrollBehavior(isOpen: boolean) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = isOpen ? "auto" : "smooth";
  }, [isOpen]);
}

export default useScrollBehavior;
