import React from 'react';
import ReactDOM from 'react-dom';
import { IdentityContextProvider } from "react-netlify-identity-widget"

import './images/plus--green.png';
import './images/sort--down.png';
import './images/sort--up.png';
import './images/sort.png';
 
import "@reach/tabs/styles.css";
import './scss/index.scss';
import App from './App.jsx';
//import * as serviceWorker from './serviceWorker';

const URL = 'https://skyeparker.netlify.app/'

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
