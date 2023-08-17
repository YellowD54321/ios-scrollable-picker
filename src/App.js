import "./App.css";
import Picker from "./components/picker/Picker";
import PickerSelect from "./components/pickerSelect/PickerSelect";
import { useState } from "react";

const testList = ["123", "456", "789", "0"];
const testListSecond = {
  123: ["123111", "123222", "123333"],
  456: ["456444", "456555", "456666"],
  789: ["789777", "789888", "789999"],
};

function App() {
  const [firstValue, setFirstValue] = useState(testList[0]);
  const [secondValue, setSecondValue] = useState(
    testListSecond[testList[0]][0]
  );

  const handleChangeFirstSelect = (value) => {
    console.log("first value", value);
    setFirstValue(value);
  };

  const handleChangeSecondSelect = (value) => {
    console.log("second value", value);
    setSecondValue(value);
  };

  return (
    <div className="App">
      <h4>{`first value: ${firstValue}`}</h4>
      <h4>{`second value: ${secondValue}`}</h4>
      <Picker>
        <PickerSelect
          value={firstValue}
          onChange={handleChangeFirstSelect}
          name="first-value"
          datas={testList}
        />
        <PickerSelect
          value={secondValue}
          onChange={handleChangeSecondSelect}
          name="seconde-value"
          datas={testListSecond[firstValue]}
        />
      </Picker>
    </div>
  );
}

export default App;
