import React, { useEffect, useRef } from "react";
import "../../static/css/scrollablePicker.css";
import PickerBackground from "./background/PickerBackground";
import Picker from "./picker/Picker";

const ScrollablePicker = ({ isOpen, onClose, ...otherProps }) => {
  const handleClickCloseButton = () => {
    onClose();
  };

  return (
    <PickerBackground isOpen={isOpen} onClose={onClose}>
      <div className="l-container">
        <Picker />
      </div>
      <button onClick={handleClickCloseButton}>Close</button>
    </PickerBackground>
  );
};

export default ScrollablePicker;
