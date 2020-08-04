/// filename: index.jsx
/// last modified: 07/30/2020
/// description: Entry point for inventory tracker app.

import React from 'react';
import ReactDOM from 'react-dom';
import { IdentityContextProvider } from "react-netlify-identity"

import './images/plus--green.png';
import './images/sort--down.png';
import './images/sort--up.png';
import './images/sort.png';
import './images/envelope.svg';
import './images/lock.svg';
import './images/user.svg';

import './scss/index.scss';
import App from './App.jsx';


const URL = 'https://skyeparker.netlify.app/';

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

/// name: fullScreen
/// description: Callback method to enter full screen when
///   user double clicks on/around inventory table.
function fullScreen() {
  const main = document.getElementById('main');
  const isInFullScreen = document.fullscreen;
  if (!isInFullScreen) {
    if (main.requestFullscreen) {
      main.requestFullscreen();
    } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen();
    } else if (this.webkitRequestFullScreen) {
      main.webkitRequestFullScreen();
    } else if (main.msRequestFullscreen) {
      main.msRequestFullscreen();
    }
  } else {
    if (main.exitFullscreen) {
      main.exitFullscreen();
    } else if (main.webkitExitFullscreen) {
      main.webkitExitFullscreen();
    } else if (main.mozCancelFullScreen) {
      main.mozCancelFullScreen();
    } else if (main.msExitFullscreen) {
      main.msExitFullscreen();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('main').addEventListener('dblclick', fullScreen);
})
