import React from 'react';
import ReactDOM from 'react-dom';
import localForage from 'localforage';

import { log } from './log';
import { config } from './config';

import { initialState } from './initialState';
import { App } from './App';

localForage
  .getItem('savedState')
  .then((savedState) => {
    ReactDOM.render(
      <App initialState={savedState ? savedState : initialState} />,
      document.getElementById('app'),
    );
  })
  .catch(log);

if (config.isDev) {
  window.clearSave = () => {
    window.indexedDB.deleteDatabase('localforage');
    window.location.reload();
  };
}

module.hot.accept();

const betterTry = (logger = () => {}) => (tryFn, catchFn) => {
  try {
    return tryFn()
  } catch (err) {
    logger(err)
    try {
      return catchFn()
    } catch (err2) {
      logger(err2)
    }
  }
}
