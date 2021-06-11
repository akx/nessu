import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import init from "./nes-rust";
await init();
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
