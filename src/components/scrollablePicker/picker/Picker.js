import React, { useState } from "react";

const FAKE_DATA = ["001", "002", "003", "004"];

const Picker = () => {
  const [datas, setDatas] = useState(FAKE_DATA);

  return (
    <div className="l-picker-content">
      <div className="l-view">
        {datas.map((data, index) => {
          return (
            <h4 key={index} className="o-item">
              {data}
            </h4>
          );
        })}
      </div>
    </div>
  );
};

export default Picker;
