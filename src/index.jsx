/// filename: index.jsx
/// last modified: 07/30/2020
/// description: Entry point for inventory tracker app.

import React from 'react';
import ReactDOM from 'react-dom';
import { IdentityContextProvider } from "react-netlify-identity";

import './images/plus--green.png';
import './images/sort--down.png';
import './images/sort--up.png';
import './images/sort.png';
import './images/envelope.svg';
import './images/lock.svg';
import './images/user.svg';

import './scss/index.scss';
import App from './App.jsx';


const URL = 'https://inventorytracker.netlify.app/';

ReactDOM.render(
  <React.StrictMode>
    <IdentityContextProvider url={URL} >
      <div></div>
      <App />
      <div></div>
    </IdentityContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
