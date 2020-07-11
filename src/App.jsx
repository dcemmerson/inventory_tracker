import React from 'react';
import { IdentityContextProvider } from "react-netlify-identity-widget"

import { Main } from './Main.jsx';

//import logo from './logo.svg';
import './App.css';

const url = 'https://wizardly-mayer-95e84a.netlify.app'

export default class App extends React.Component {

  componentDidMount() {
    this.fetchInventory();
  }

  fetchInventory() {
    return fetch(`/.netlify/functions/get_inventory`, {
      method: 'GET',
    })
      .then(inventory => {
        console.log(inventory);
        return inventory;
      })
      .then(res => res.json())
      .then(results => console.log(results))
  }

  render() {
    return (
      <IdentityContextProvider url={url} >
        <Main />
      </IdentityContextProvider>
    );
  }
}

