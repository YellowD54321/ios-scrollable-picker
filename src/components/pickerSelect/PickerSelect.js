import React, { useContext, useEffect, useRef } from "react";
import { pickerContext } from "../picker/Picker";

const PICKER_HEIGHT = 10 * 16;
const SELECT_REGION_HEIGHT = 2 * 16;
const OPTION_MARGIN_TOP = 1 * 16;

const GRAB_SLIDE_MS = 100;
const GRAB_RECORD_NUMBER = 10;

const PickerSelect = ({ value, onChange, name, datas, defaultValue }) => {
  const { picker } = useContext(pickerContext);
  const selectRef = useRef();
  const optionRefs = useRef([]);
  const grab = useRef(getInitialGrab());
  const grabSliderId = useRef();

  useEffect(() => {
    const selectElement = selectRef.current;
    selectElement.addEventListener("scroll", handleScroll);
    selectElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    const grabRecordTimer = setInterval(
      recordGrabDistance,
      GRAB_SLIDE_MS / GRAB_RECORD_NUMBER
    );
    return () => {
      selectElement.removeEventListener("scroll", handleScroll);
      selectElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(grabRecordTimer);
    };
  }, []);

  // initial observer
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
    // scroll to default value or top
    scrollToTarget();
    // set style when initialization
    handleScroll();
  }, [picker, datas]);

  const observerCallback = (entries) => {
    if (entries?.length >= datas?.length) {
      // will get the entire data list when the very beginning
      // set value to default value or first item.
      onChange(defaultValue || datas?.[0] || datas || "");
      return;
    }
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }
      const list = optionRefs.current;
      const target = list.find((option) => option === entry.target);
      if (!target) {
        continue;
      }
      // get display text and set it as value
      const value = target.innerHTML;
      onChange(value);
    }
  };

  function getInitialGrab() {
    return {
      isGrabbing: false,
      startY: 0,
      previousY: 0,
      currentY: 0,
      distance: 0,
      distances: new Array(GRAB_RECORD_NUMBER).fill(0),
      timeCounter: 0,
      scrollTop: 0,
    };
  }

  /**
   * Sliding select element after grabbing finished on PC.
   * Keep sliding if distance still exists.
   * @param {number} distance first distance is distance of grabbing. Then decrease whenever function is called.
   */
  const grabSliding = (distance) => {
    distance *= 0.5;
    const selectElement = selectRef.current;
    if (!selectElement) {
      window.cancelAnimationFrame(grabSliderId.current);
      grab.current = getInitialGrab();
      return;
    }
    selectElement.scrollTop -= distance;
    if (
      Math.abs(distance) > 1 &&
      selectElement.scrollTop > 0 &&
      selectElement.scrollTop <
        selectElement.scrollHeight - selectElement.offsetHeight
    ) {
      // if distance is still exists, run it again.
      grabSliderId.current = window.requestAnimationFrame(() =>
        grabSliding(distance)
      );
    } else {
      window.cancelAnimationFrame(grabSliderId.current);
      // add scroll-snap-type back after sliding is finished.
      selectElement.style.scrollSnapType = "y mandatory";
      // initial grab data.
      grab.current = getInitialGrab();
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    // conflix with scroll-snap-type effect. remove it when grabbing.
    const selectElement = selectRef.current;
    selectElement.style.scrollSnapType = "none";
    // set grab data
    grab.current = getInitialGrab();
    grab.current.isGrabbing = true;
    grab.current.startY = e.pageY;
    grab.current.currentY = e.pageY;
    grab.current.previousY = e.pageY;
    grab.current.distances = new Array(GRAB_RECORD_NUMBER).fill(0);
    grab.current.timeCounter = 0;
    grab.current.scrollTop = selectElement.scrollTop;
    window.cancelAnimationFrame(grabSliderId.current);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const selectElement = selectRef.current;
    if (!grab.current.isGrabbing) {
      return;
    }
    // keep select staying with mouse.
    const dy = e.pageY - grab.current.startY;
    const startScrollTop = grab.current.scrollTop;
    selectElement.scrollTop = startScrollTop - dy;
    // record current Y
    grab.current.currentY = e.pageY;
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    // disable grabbing.
    grab.current.isGrabbing = false;
    // calculate grab distance.
    const dy = grab.current.distances.reduce((sum, dy) => sum + dy, 0);
    // run sliding.
    window.cancelAnimationFrame(grabSliderId.current);
    grabSliderId.current = window.requestAnimationFrame(() => grabSliding(dy));
  };

  // change option's style when select scrolling.
  const handleScroll = () => {
    const selectElement = selectRef.current;
    const options = optionRefs.current;
    const selectHeight = selectElement.offsetHeight;
    const scrollTop = selectElement.scrollTop;
    for (const option of options) {
      const optionHeight = option.offsetHeight;
      const selectRetionTopY = scrollTop;
      const selectRegionBottomY = selectRetionTopY + SELECT_REGION_HEIGHT;
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
        option.style.opacity = (1 - ratio) * 0.5;
      } else if (optionTop > selectRegionBottomY) {
        const bottomRegionHeight = (selectHeight - SELECT_REGION_HEIGHT) / 2;
        const ratio = (optionTop - selectRegionBottomY) / bottomRegionHeight;
        option.style.opacity = (1 - ratio) * 0.5;
      } else {
        option.style.opacity = 1;
      }
    }
  };

  // record grab distance when select is grabbing on pc.
  const recordGrabDistance = () => {
    if (grab.current.isGrabbing !== true) {
      return;
    }
    // record distance
    grab.current.distances[grab.current.timeCounter] =
      grab.current.currentY - grab.current.previousY;
    // update previous y
    grab.current.previousY = grab.current.currentY;
    // set next array index
    grab.current.timeCounter += 1;
    if (grab.current.timeCounter >= GRAB_RECORD_NUMBER) {
      grab.current.timeCounter = 0;
    }
  };

  const scrollToY = (y) => {
    const selectElement = selectRef.current;
    if (!selectElement) {
      return;
    }
    selectElement.scrollTo({
      top: y,
    });
  };

  const scrollToTop = () => {
    scrollToY(0);
  };

  const scrollToTarget = () => {
    if (
      !defaultValue ||
      !optionRefs.current ||
      optionRefs.current.length <= 0
    ) {
      scrollToTop();
      return;
    }
    // if there is an option's display text equals to default value, set it as target.
    const targetElement = optionRefs.current.find(
      (option) => option.textContent === defaultValue
    );
    if (!targetElement) {
      scrollToTop();
      return;
    }
    targetElement.scrollIntoView({
      block: "center",
    });
  };

  const handleClickOption = (e) => {
    const CLICK_RANGE = 10;
    if (
      grab.current.startY &&
      Math.abs(grab.current.startY - e.pageY) >= CLICK_RANGE
    ) {
      return;
    }
    const offsetTop = e.target.offsetTop;
    const y = offsetTop - SELECT_REGION_HEIGHT * 2;
    scrollToY(y);
  };

  // if datas is a single data instead of array, set it as array.
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
