import React, { useContext, useEffect, useRef } from "react";
import { pickerContext } from "../picker/Picker";

const PICKER_HEIGHT = 10 * 16;
const SELECT_REGION_HEIGHT = 2 * 16;
const OPTION_MARGIN_TOP = 1 * 16;

const PickerSelect = ({ value, onChange, name, datas }) => {
  const { picker } = useContext(pickerContext);
  const selectRef = useRef();
  const optionRefs = useRef([]);
  const grab = useRef({
    isGrabbing: false,
    startY: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    const selectElement = selectRef.current;
    selectElement.addEventListener("scroll", handleScroll);
    selectElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      selectElement.removeEventListener("scroll", handleScroll);
      selectElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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
    handleScroll();
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    const selectElement = selectRef.current;
    // conflix with scroll-snap-type effect. remove it when grabbing.
    selectElement.style.scrollSnapType = "none";
    grab.current.isGrabbing = true;
    grab.current.startY = e.pageY;
    grab.current.scrollTop = selectElement.scrollTop;
  };

  const handleMouseMove = (e) => {
    const selectElement = selectRef.current;
    e.preventDefault();
    if (!grab.current.isGrabbing) {
      return;
    }

    const dy = e.pageY - grab.current.startY;
    const startScrollTop = grab.current.scrollTop;
    selectElement.scrollTop = startScrollTop - dy;
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    const selectElement = selectRef.current;
    selectElement.style.scrollSnapType = "y mandatory";
    grab.current.isGrabbing = false;
    grab.current.startY = 0;
  };

  const handleScroll = () => {
    const selectElement = selectRef.current;
    const options = optionRefs.current;
    const selectHeight = selectElement.offsetHeight;
    const scrollTop = selectElement.scrollTop;

    for (const option of options) {
      const optionHeight = option.offsetHeight;
      const selectRetionTopY = scrollTop;
      const selectRegionBottomY = scrollTop + SELECT_REGION_HEIGHT;
      const optionOffsetTop = option.offsetTop;
      const INACCURACY_PIXEL = SELECT_REGION_HEIGHT / 2;
      const optionTop =
        optionOffsetTop -
        optionHeight -
        OPTION_MARGIN_TOP * 3 +
        INACCURACY_PIXEL;

      if (optionTop < selectRetionTopY) {
        const topRegionHeight = (selectHeight - SELECT_REGION_HEIGHT) / 2;
        const ratio = (selectRetionTopY - optionTop) / topRegionHeight;
        option.style.opacity = 1 - ratio;
      } else if (optionTop > selectRegionBottomY) {
        const bottomRegionHeight = (selectHeight - SELECT_REGION_HEIGHT) / 2;
        const ratio = (optionTop - selectRegionBottomY) / bottomRegionHeight;
        option.style.opacity = 1 - ratio;
      } else {
        option.style.opacity = 1;
      }
    }
  };

  const scrollTo = (y, isSmooth) => {
    if (!selectRef.current) {
      return;
    }
    const options = {
      top: y,
    };
    if (isSmooth) {
      options.behavior = "smooth";
    }
    selectRef.current.scrollTo(options);
  };

  const scrollToTop = () => {
    scrollTo(0);
  };

  const handleClickOption = (e) => {
    const offsetTop = e.target.offsetTop;
    const y = offsetTop - SELECT_REGION_HEIGHT * 2;
    scrollTo(y, true);
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
            className={`picker-option picker-option--${name}`}
            onClick={handleClickOption}
          >
            {value}
          </li>
        );
      })}
    </ul>
  );
};

export default PickerSelect;
