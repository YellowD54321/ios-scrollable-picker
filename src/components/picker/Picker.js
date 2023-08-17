import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const contextdefaultValue = {
  picker: null,
};
export const pickerContext = createContext(contextdefaultValue);
export const PickerProvider = ({ children }) => {
  const [picker, setPicker] = useState(contextdefaultValue.picker);

  return (
    <pickerContext.Provider value={{ picker, setPicker }}>
      {children}
    </pickerContext.Provider>
  );
};

const Picker = ({ children }) => {
  const { setPicker } = useContext(pickerContext);
  const pickerRef = useRef();

  useEffect(() => {
    setPicker(pickerRef.current);
  }, [pickerRef.current]);

  return (
    <div className="picker" ref={pickerRef}>
      <div className="selects">{children}</div>
      <div className="upper-region"></div>
      <div className="selected-region"></div>
      <div className="lower-region"></div>
    </div>
  );
};

const WheelPicker = ({ children }) => {
  return (
    <PickerProvider>
      <Picker>{children}</Picker>
    </PickerProvider>
  );
};

export default WheelPicker;
