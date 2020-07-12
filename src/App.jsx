import React from 'react';
import { IdentityContextProvider } from "react-netlify-identity-widget"

import { Main } from './Main.jsx';

//import logo from './logo.svg';
import './App.css';

const url = 'https://wizardly-mayer-95e84a.netlify.app'

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
    }
  }

  async componentDidMount() {
    const inventory = await this.getInventory();
    console.log(inventory);
    this.setState({ inventory: inventory });
  }

  normalizeInventoryData(inventory) {
    console.log(inventory);
    inventory.data = inventory.data.map(item => {
      item.data.burnRate = item.data.burn_rate;
      item.data.daysLeft = (item.data.quantity / item.data.burnRate).toFixed(1);
      return item;
    })
    return inventory;
  }

  getInventory() {
    return fetch(`/.netlify/functions/get_inventory`, {
      method: 'GET',
    })
      .then(inventoryDb => {
        console.log(inventoryDb);
        return inventoryDb;
      })
      .then(res => res.json())
      .then(this.normalizeInventoryData)
      .then(normalizedInventory => {
        return normalizedInventory.data.sort(byBurnRate);
      })
  }

  insertInventory(id, name = "testName", quantity = 12, burnRate = 2) {
    return fetch(`/.netlify/functions/insert_inventory`, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        name: name,
        quantity: quantity,
        burnRate: burnRate
      })
    })
      .then(inventory => {
        console.log(inventory);
        return inventory;
      })
      .then(res => res.json())
      .then(results => console.log(results))
  }

  updateInventory(id = 5, name = "anotherTest", quantity = 16, burnRate = 1.5) {
    return fetch(`/.netlify/functions/update_inventory`, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        name: name,
        quantity: quantity,
        burnRate: burnRate
      })
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
        <Main
          inventory={this.state.inventory}
        />
      </IdentityContextProvider>
    );
  }
}

function byQuantity(a, b) {
  a.data.quantity = parseFloat(a.data.quantity);
  b.data.quantity = parseFloat(b.data.quantity);

  if(a.data.quantity < b.data.quantity) {
    return -1;
  }
  else if(a.data.quantity === b.data.quantity) {
    return 0;
  }
  else {
    return 1;
  }
}

function byDaysLeft(a, b) {
  a.data.daysLeft = parseFloat(a.data.daysLeft);
  b.data.daysLeft = parseFloat(b.data.daysLeft);

  if(a.data.daysLeft < b.data.daysLeft) {
    return -1;
  }
  else if(a.data.daysLeft === b.data.daysLeft) {
    return 0;
  }
  else {
    return 1;
  }
}

function byBurnRate(a, b) {
  a.data.burnRate = parseFloat(a.data.burnRate);
  b.data.burnRate = parseFloat(b.data.burnRate);

  if(a.data.burnRate < b.data.burnRate) {
    return -1;
  }
  else if(a.data.burnRate === b.data.burnRate) {
    return 0;
  }
  else {
    return 1;
  }
}

function byName(a, b,) {
  if(a.data.name < b.data.name) {
    return -1;
  }
  else if(a.data.name === b.data.name) {
    return 0;
  }
  else {
    return 1;
  }
}

function reverseArray(arr) {
  return arr.slice().reverse();
}
