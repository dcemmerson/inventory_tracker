import React, { useState, useEffect } from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

import { Main } from './Main.jsx';
import { deepCopy, getSortMethod } from './utility';
//import logo from './logo.svg';
import './App.css';

const DEFAULT_START_QUANTITY = 10;
const DEFAULT_START_NAME = "New item";
const DEFAULT_START_BURN_RATE = 1;
const ASCII_CODE_DECIMAL = 46;
const ASCII_CODE_ZERO = 48;
const ASCII_CODE_NINE = 57;

export default function App(props) {
  const identity = useIdentityContext()
  const [inventory, setInventory] = useState([]);
  const [prevInventory, setPrevInventory] = useState([]);
  const [loggedIn, setLoggedIn] = useState(identity && identity.isLoggedIn);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState("byDaysLeft");

  useEffect(() => {
    if (loggedIn) {
      setLoading(true);
      getInventory(identity.user.token.access_token)
        .then(inventory => {
          console.log(inventory);
          setInventory(inventory);
          setPrevInventory(deepCopy(inventory));
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loading && !updating && loggedIn) {
      const sortedInventory = deepCopy(inventory);
      sortedInventory.sort(getSortMethod(sortBy, sortAsc));
      setInventory(sortedInventory);
    }
  }, [sortBy, sortAsc, loading, updating, loggedIn]);

  function sortItems(changeToSort) {
    if (sortBy === changeToSort) {
      setSortAsc(!sortAsc)
    }
    else {
      setSortBy(changeToSort);
      setSortAsc(true);
    }
  }

  function handleNumericInput(itemId, e) {

    const key = e.target.name;
    let value = e.target.value;
    const charCode = value.charCodeAt(value.length - 1);

    if (charCode >= ASCII_CODE_ZERO && charCode <= ASCII_CODE_NINE) {
      value = parseFloat(e.target.value);
    }
    else if (charCode !== ASCII_CODE_DECIMAL) {
      return;
    }

    const newInventory = inventory.map(item => {
      if (item.data.id === itemId) {
        item.data[key] = value;
        item.editted = true;
      }
      return item;
    });
    setInventory(newInventory);
  }

  function handleStringInput(itemId, e) {
    console.log(itemId);
    const key = e.target.name;
    const value = e.target.value;
    const newInventory = inventory.map(item => {
      if (item.data.id === itemId) {
        item.data[key] = value;
        item.editted = true;
      }
      return item;
    });
    setInventory(newInventory);
  }

  function handleCancelEdits() {
    setInventory(deepCopy(prevInventory));
  }

  function handleSaveEdits() {
    setUpdating(true);
    updateInventory(inventory, identity.user.token.access_token)
      .then(updatedInventory => {
        console.log("updte inv = ")
        console.log(updatedInventory)
        setInventory(updatedInventory);
        setPrevInventory(deepCopy(updatedInventory));

        setUpdating(false);
      })

  }

  function addItemRow() {
    let newItemId = -1;

    inventory.forEach(item => {
      if (item.data.id >= newItemId) {
        newItemId = item.data.id + 1;
      }
    })

    const newInventory = deepCopy(inventory).concat({
      editMode: true,
      newItem: true,
      data: {
        id: newItemId,
        quantity: DEFAULT_START_QUANTITY,
        name: DEFAULT_START_NAME,
        burnRate: DEFAULT_START_BURN_RATE,
        daysLeft: (DEFAULT_START_QUANTITY / DEFAULT_START_BURN_RATE).toFixed(1),
      }
    })

    setInventory(newInventory);
  }

  function removeItemRow(id) {
    let newInventory = deepCopy(inventory)
    newInventory = newInventory.map(item => {
      if (item.data.id === id) {
        item.deleteItem = true;
        item.editMode = false;
      }
      return item;
    })
    setInventory(newInventory);

  }


  function normalizeInventoryData(inv) {
    console.log('unnormalized inv = ');
    console.log(inv);
    if (!inv.data) {
      return new Error(`No inventory.data: ${inv.msg}`);
    }
    inv.data = inv.data.map(item => {
      item.data.daysLeft = (item.data.quantity / item.data.burnRate).toFixed(1);
      item.editMode = false;
      return item;
    })
    return inv.data.sort(getSortMethod(sortBy, sortAsc));
  }

  function setItemEditMode(itemId, editMode = true) {
    const newInventory = inventory.map(item => {
      if (item.data.id === itemId) {
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

          return normalizedInventory;
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      return [];
    }
  }

  function updateInventory(edittedInventory, token) {
    if (loggedIn) {
      return fetch(`/.netlify/functions/update_inventory`, {
        method: 'POST',
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(edittedInventory),
      })
        .then(res => res.json())
        .then(results => {
          console.log(results);
          if (!results.success) {
            throw new Error(results.error);
          }
          return results;
        })
        .then(normalizeInventoryData)
        .catch(err => {
          console.log(err);
        })
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


  return (
    <div>
      <Main
        inventory={inventory}
        setItemEditMode={setItemEditMode}
        setLoggedIn={setLoggedIn}
        handleNumericInput={handleNumericInput}
        handleStringInput={handleStringInput}
        handleCancelEdits={handleCancelEdits}
        handleSaveEdits={handleSaveEdits}
        loading={loading}
        updating={updating}
        addItemRow={addItemRow}
        removeItemRow={removeItemRow}
        sortItems={sortItems}
      />
    </div>

  );
}
