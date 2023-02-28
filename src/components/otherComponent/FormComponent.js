import React, { useState } from "react";
import "../../static/css/formComponent.css";
import ScrollablePicker from "../scrollablePicker/ScrollablePicker";

const FormComponent = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleClickCanlender = (e) => {
    e.preventDefault();
    setIsPickerOpen(true);
  };

  const handleClickSubmitButton = (e) => {
    e.preventDefault();
    return;
  };

  return (
    <form onSubmit={handleClickSubmitButton} className="l-form-component">
      <h4>Form Title</h4>
      <input placeholder="input text" />
      <select onClick={handleClickCanlender}>
        <option>001</option>
        <option>002</option>
        <option>003</option>
        <option>004</option>
      </select>
      <input type="submit" />
      <ScrollablePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </form>
  );
};

export default FormComponent;
