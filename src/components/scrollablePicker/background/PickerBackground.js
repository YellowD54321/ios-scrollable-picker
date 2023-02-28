import React, { useRef, useEffect } from "react";

const hideClassName = "non-display";

const PickerBackground = ({ children, isOpen }) => {
  const pickerRef = useRef();

  useEffect(() => {
    if (isOpen === true) {
      pickerRef.current.classList.remove(hideClassName);
    } else {
      pickerRef.current.classList.add(hideClassName);
    }
  }, [isOpen]);

  return (
    <div className="scrollable-picker non-display" ref={pickerRef}>
      {children}
    </div>
  );
};

export default PickerBackground;
