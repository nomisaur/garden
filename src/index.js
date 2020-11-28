import React from "react";
import ReactDOM from "react-dom";
import localForage from "localforage";

import { initialState } from "./initialState";
import { App } from "./App";
import "./styles.scss";

localForage
  .getItem("savedState")
  .then((savedState) =>
    ReactDOM.render(
      <App initialState={savedState ? savedState : initialState} />,
      document.getElementById("app")
    )
  )
  .catch(console.log);

window.clearSave = () => window.indexedDB.deleteDatabase("localforage");

module.hot.accept();
