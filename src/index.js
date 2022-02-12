import React from 'react';
import ReactDOM from 'react-dom';
import localForage from 'localforage';

import { isDev } from './config';
import { log } from './utils';

import { initialState } from './initialState';
import { App } from './App';
import * as playground from './playground';

if (isDev) {
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
