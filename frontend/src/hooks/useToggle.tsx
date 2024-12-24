import { useState } from "react";

type ToggleState = {
  [key: string]: boolean;
};

const useToggle = (obj: ToggleState) => {
  const [toggleState, setToggles] = useState<ToggleState>(obj);

  const toggle = (key: keyof typeof toggleState) => {
    setToggles((prevToggle) => {
      return {
        ...prevToggle,
        [key]: !prevToggle[key],
      };
    });
  };

  return { toggleState, toggle };
};

export default useToggle;
