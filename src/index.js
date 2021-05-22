import React from 'react';
import ReactDOM from 'react-dom';
import localForage from 'localforage';

import { log } from './log';
import { config } from './config';

import { initialState } from './initialState';
import { App } from './App';
import * as playground from './playground';

if (config.isDev) {
  window.dev = {};
  window.dev.clearSave = () => {
    window.indexedDB.deleteDatabase('localforage');
    window.location.reload();
  };
  window.p = playground;
}

localForage
  .getItem('savedState')
  .then((savedState) => {
    ReactDOM.render(
      <App initialState={savedState || initialState} />,
      document.getElementById('app'),
    );
  })
  .catch(log);

module.hot.accept();
