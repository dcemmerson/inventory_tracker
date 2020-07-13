import React, { useState, useEffect } from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

import { Main } from './Main.jsx';

//import logo from './logo.svg';
import './App.css';


export default function App(props) {
  const identity = useIdentityContext()
  const [inventory, setInventory] = useState([]);
  const [loggedIn, setLoggedIn] = useState(identity && identity.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      getInventory(identity.user.token.access_token)
        .then(inventory => {
          console.log(inventory);
          setInventory(inventory);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [loggedIn]);

  function handleInventoryInput(itemId, e) {
    const key = e.target.name;
    const value = e.target.value;
    const newInventory = inventory.map(item => {
      if(item.data.id == itemId) {
        item.data[key] = value;
      }
      return item;
    });
    setInventory(newInventory);
  }

  function handleAddItem() {

  }

  function normalizeInventoryData(inventory) {
    console.log('unnormalized inv = ');
    console.log(inventory);
    if (!inventory.data) {
      return new Error(`No inventory.data: ${inventory.msg}`);
    }
    inventory.data = inventory.data.map(item => {
      item.data.daysLeft = (item.data.quantity / item.data.burnRate).toFixed(1);
      item.editMode = false;
      return item;
    })
    return inventory.data;
  }

  function setItemEditMode(itemId, editMode=true) {
    const newInventory = inventory.map(item => {
      if(item.data.id === itemId) {
        item.editMode = true;
      }
      return item;
    });
    setInventory(newInventory);
  }
  function getInventory(token) {
    if (loggedIn) {
      return fetch(`/.netlify/functions/get_inventory`, {
        method: 'GET',
        credentials: "include",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(res => res.json())
        .then(normalizeInventoryData)
        .then(normalizedInventory => {
          console.log('normainv = ');
          console.log(normalizedInventory);

          return normalizedInventory.sort(byBurnRate);
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      return [];
    }
  }

  function insertInventory(id, name = "testName", quantity = 12, burnRate = 2) {
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

  function updateInventory(id = 5, name = "anotherTest", quantity = 16, burnRate = 1.5) {
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

  return (
    <Main
      inventory={inventory}
      setItemEditMode={setItemEditMode}
      setLoggedIn={setLoggedIn}
      loading={loading}
      handleInventoryInput={handleInventoryInput}
    />
  );
}

function byQuantity(a, b) {
  a.quantity = parseFloat(a.quantity);
  b.quantity = parseFloat(b.quantity);

  if (a.quantity < b.quantity) {
    return -1;
  }
  else if (a.quantity === b.quantity) {
    return 0;
  }
  else {
    return 1;
  }
}

function byDaysLeft(a, b) {
  a.daysLeft = parseFloat(a.daysLeft);
  b.daysLeft = parseFloat(b.daysLeft);

  if (a.daysLeft < b.daysLeft) {
    return -1;
  }
  else if (a.daysLeft === b.daysLeft) {
    return 0;
  }
  else {
    return 1;
  }
}

function byBurnRate(a, b) {
  a.burnRate = parseFloat(a.burnRate);
  b.burnRate = parseFloat(b.burnRate);

  if (a.burnRate < b.burnRate) {
    return -1;
  }
  else if (a.burnRate === b.burnRate) {
    return 0;
  }
  else {
    return 1;
  }
}

function byName(a, b,) {
  if (a.name < b.name) {
    return -1;
  }
  else if (a.name === b.name) {
    return 0;
  }
  else {
    return 1;
  }
}

function reverseArray(arr) {
  return arr.slice().reverse();
}
