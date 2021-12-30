import React from 'react';
import ReactDOM from 'react-dom';
import localForage from 'localforage';

import { config } from './config';
import { log } from './utils';

import { initialState } from './initialState';
import { App } from './App';
import * as playground from './playground';

if (config.isDev) {
   window.dev = {
      clearSave: () => {
         window.indexedDB.deleteDatabase('localforage');
         window.location.reload();
      },
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
