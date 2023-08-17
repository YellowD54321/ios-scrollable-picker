import React, { useContext, useEffect, useRef } from "react";
import { pickerContext } from "../picker/Picker";

const PICKER_HEIGHT = 10 * 16;
const SELECT_REGION_HEIGHT = 2 * 16;

const PickerSelect = ({ value, onChange, name, datas }) => {
  const { picker } = useContext(pickerContext);
  const selectRef = useRef();
  const optionRefs = useRef([]);

  useEffect(() => {
    if (!picker) {
      return;
    }
    const pickerHeight = PICKER_HEIGHT;
    const selectRegionHeight = SELECT_REGION_HEIGHT;
    const INACCURACY_PIXEL = 5;
    const margin = (pickerHeight - selectRegionHeight) / 2 - INACCURACY_PIXEL;

    const options = {
      root: picker,
      rootMargin: `-${margin}px 0px -${margin}px 0px`,
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(observerCallback, options);
    const targets = [];
    const targetElements = document.getElementsByClassName(
      `picker-option--${name}`
    );
    for (const targetElement of targetElements) {
      observer.observe(targetElement);
      targets.push(targetElement);
    }
    optionRefs.current = targets;
    scrollToTop();
  }, [picker, datas]);

  const observerCallback = (entries) => {
    if (entries?.length > 1) {
      onChange(datas[0] || "");
      return;
    }
    for (const entry of entries) {
      const list = optionRefs.current;
      const target = list.find((option) => option === entry.target);
      if (!target) {
        continue;
      }
      const value = target.innerHTML;
      onChange(value);
    }
  };

  const scrollToTop = () => {
    if (!selectRef.current) {
      return;
    }
    selectRef.current.scrollTo(0, 0);
  };

  const options = !datas ? [""] : !Array.isArray(datas) ? [datas] : datas;

  return (
    <ul value={value} onChange={onChange} ref={selectRef}>
      {options.map((data, index) => {
        const value = data || "";
        const key = value + index;
        return (
          <li
            key={key}
            value={value}
            className={`picker-option picker-option--${name}`}
          >
            {value}
          </li>
        );
      })}
    </ul>
  );
};

export default PickerSelect;
