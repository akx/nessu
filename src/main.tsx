import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import init from "./nes-rust";
async function boot() {
  // @ts-ignore
  await init();
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
boot();
