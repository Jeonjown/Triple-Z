import { useEffect } from "react";

export const useDisableNumberInputScroll = (): void => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent): void => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" &&
        (target as HTMLInputElement).type === "number"
      ) {
        e.preventDefault();
      }
    };

    // Attach a listener at the document level
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);
};

export default useDisableNumberInputScroll;
