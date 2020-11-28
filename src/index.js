import React from "react";
import ReactDOM from "react-dom";
import localForage from "localforage";

import { log } from "./log";
import { config } from "./config";

import { initialState } from "./initialState";
import { App } from "./App";
import "./styles.scss";

localForage
  .getItem("savedState")
  .then((savedState) => {
    ReactDOM.render(
      <App initialState={savedState ? savedState : initialState} />,
      document.getElementById("app")
    );
  })
  .catch(log);

if (config.isDev) {
  window.clearSave = () => {
    window.indexedDB.deleteDatabase("localforage");
    window.location.reload();
  };
}

module.hot.accept();
