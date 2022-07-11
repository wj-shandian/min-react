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

let element2 = (
  <div id="A1" style={style}>
    render-3
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
ReactDOM.render(element, document.getElementById("root"));
console.log(element);

let render2 = document.getElementById("render2");
render2.addEventListener("click", () => {
  let element1 = (
    <div id="A2" style={style}>
      render-2
      <div id="B2" style={style}>
        B2
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
      <div id="B3" style={style}>
        render-b3
      </div>
    </div>
  );
  ReactDOM.render(element1, document.getElementById("root"));
});
let render3 = document.getElementById("render3");
render3.addEventListener("click", () => {
  let element3 = (
    <div id="A2" style={style}>
      render-3
      <div id="B2" style={style}>
        B2
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
  ReactDOM.render(element3, document.getElementById("root"));
});
