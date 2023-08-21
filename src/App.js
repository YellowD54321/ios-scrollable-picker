import "./App.css";
import Picker from "./components/picker/Picker";
import PickerSelect from "./components/pickerSelect/PickerSelect";
import { useState } from "react";

const testList = new Array(100).fill("").map((_, index) => `${index + 2}`);
const testListSecond = {};
for (const testItem of testList) {
  testListSecond[testItem] = new Array(100)
    .fill("")
    .map((_, index) => `${testItem}-${index}`);
}

function App() {
  const [firstValue, setFirstValue] = useState(testList[0]);
  const [secondValue, setSecondValue] = useState(
    testListSecond[testList[0]][0]
  );

  const handleChangeFirstSelect = (value) => {
    setFirstValue(value);
  };

  const handleChangeSecondSelect = (value) => {
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
          defaultValue={testList[5]}
        />
        <PickerSelect
          value={secondValue}
          onChange={handleChangeSecondSelect}
          name="seconde-value"
          datas={testListSecond[firstValue]}
          defaultValue={testListSecond[firstValue][4]}
        />
      </Picker>
    </div>
  );
}

export default App;
