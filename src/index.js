import React from "./component/react";
import ReactDOM from "./component/react-dom";

let style = {
  border: "1px solid red",
  margin: "5px",
};
let element = (
  <div id="A1" style={style}>
    A1
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>
        C1
      </div>
      <div id="C2" style={style}>
        C2
      </div>
    </div>
    <div id="B2" style={style}>
      B2
    </div>
  </div>
);
console.log(
  document.getElementById("root"),
  ' document.getElementById("root")'
);
ReactDOM.render(element, document.getElementById("root"));
console.log(element);
