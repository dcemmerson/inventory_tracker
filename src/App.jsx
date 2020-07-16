import React, { useState, useEffect } from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

import { Main } from './Main.jsx';
import { deepCopy, getSortMethod } from './utility';

const DEFAULT_START_QUANTITY = 10;
const DEFAULT_START_NAME = "New item";
const DEFAULT_START_BURN_RATE = 1;
const ASCII_CODE_DECIMAL = 46;
const ASCII_CODE_ZERO = 48;
const ASCII_CODE_NINE = 57;
const DEFAULT_FETCH_TIMER = 60 * 1000 * 2; // 2 minutes, 1 in dev
const RETRY_REQUEST_WAIT = 60 * 1000; // 1 minute

export default function App(props) {
  const identity = useIdentityContext()
  const [inventory, setInventory] = useState([]);
  const [prevInventory, setPrevInventory] = useState([]);
//  const [loggedIn, setLoggedIn] = useState(identity && identity.isLoggedIn);
  //State when loading inventory from server for the first time.
  const [loading, setLoading] = useState(true);
  //State when we make timed interval request to retrieve updates form server.
  const [updating, setUpdating] = useState(false);
  //State when user selects save button and we send updated inventory to server, but before we hear back from server.     
  const [saving, setSaving] = useState(false);
  //State when user is actively editing inventory in table.
  const [userEditing, setUserEditing] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState("byDaysLeft");
  const [timer, setTimer] = useState(null);
  const [fetchError, setFetchError] = useState(true);

  const isLoggedIn = identity && identity.isLoggedIn;
  const userEditingRef = React.useRef(userEditing);
  userEditingRef.current = userEditing;
  const updatingRef = React.useRef(updating);
  updatingRef.current = updating;
  

  useEffect(() => {
    fetchInventory();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!loading && !updating && isLoggedIn) {
      const sortedInventory = deepCopy(inventory);
      sortedInventory.sort(getSortMethod(sortBy, sortAsc));
      setInventory(sortedInventory);
    }
  }, [sortBy, sortAsc, loading, updating, isLoggedIn]);

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
    else if (charCode !== ASCII_CODE_DECIMAL && value !== '') {
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
    setUserEditing(false);
    setInventory(deepCopy(prevInventory));
  }

  function handleSaveEdits() {
    setSaving(true);
    setUserEditing(false);

    updateInventory(inventory, identity.user.token.access_token)
      .then(updatedInventory => {
        setInventory(updatedInventory);
        setPrevInventory(deepCopy(updatedInventory));

        setSaving(false);
      })

  }

  function addItemRow() {
    setUserEditing(true);
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
    let newInventory = deepCopy(inventory);
    let itemInDb = true;
    newInventory = newInventory.map(item => {
      if (item.data.id === id) {
        item.deleteItem = true;
        item.editMode = false;
        if (item.newItem) {
          itemInDb = false;
        }
      }
      return item;
    });

    if (!itemInDb) {
      const filteredInventory = newInventory.filter(item => item.data.id === id ? null : item);
      setInventory(filteredInventory);

    }
    else {
      setInventory(newInventory);

    }

  }

  function normalizeInventoryData(inv) {
    console.log('unnormalized inv = ');
    console.log(inv);
    if (!inv.data) {
      retryFetchInventory(RETRY_REQUEST_WAIT);
      throw new Error(`No inventory.data: ${inv.msg}`);
    }
    inv.data = inv.data.map(item => {
      item.data.daysLeft = (item.data.quantity / item.data.burnRate).toFixed(1);
      item.editMode = false;
      return item;
    })
    return inv.data.sort(getSortMethod(sortBy, sortAsc));
  }

  function retryFetchInventory(interval = RETRY_REQUEST_WAIT) {
    setTimer(createFetchTimer());

  }
  function setItemEditMode(itemId, editMode = true) {
    const newInventory = inventory.map(item => {
      if (item.data.id === itemId && !item.deleteItem) {
        item.editMode = true;
        setUserEditing(true);
      }
      return item;
    });
    setInventory(newInventory);
  }

  // function getInventory(token) {
  //   if (isLoggedIn) {
  //     return fetch(`/.netlify/functions/get_inventory`, {
  //       method: 'GET',
  //       cache: "no-store",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     })
  //       .then(res => res.json())
  //       .then(normalizeInventoryData)
  //       .then(normalizedInventory => {
  //         if (inventory.loggedIn === false) { //check for false, not just truthiness.
  //           identity.logoutUser();
  //           throw new Error(inventory);
  //         }
  //         console.log('normainv = ');
  //         console.log(normalizedInventory);
  //         setFetchError(false);
  //         return normalizedInventory;
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setFetchError(true);
  //       })
  //   }
  //   else {
  //     return [];
  //   }
  // }
    function getInventory(token) {
    if (isLoggedIn) {
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
          if (inventory.loggedIn === false) { //check for false, not just truthiness.
            identity.logoutUser();
            throw new Error(inventory);
          }
          console.log('normainv = ');
          console.log(normalizedInventory);
          setFetchError(false);
          return normalizedInventory;
        })
        .catch(err => {
          console.log(err);
          setFetchError(true);
        })
    }
    else {
      return [];
    }
  }

  function updateInventory(edittedInventory, token) {
    if (isLoggedIn) {
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

  function fetchInventory(isUserEditing = false, isUpdating) {
    if (!isLoggedIn) {
      return;
    }
    else if (isUpdating || isUserEditing) {
      window.clearTimeout(timer);
      setTimer(createFetchTimer());
    }
    else {
      if (timer) {
        window.clearTimeout(timer);
      }
      setUpdating(true);
      getInventory(identity.user.token.access_token)
        .then(inventory => {
          if (inventory.loggedIn === false) { //check for false, not just truthiness.
            identity.logoutUser();
            throw new Error(inventory);
          }
          console.log(inventory);
          setInventory(inventory);
          setPrevInventory(deepCopy(inventory));

          setTimer(createFetchTimer());
          console.log(new Date());
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setUpdating(false);
        })
    }
  }

  function createFetchTimer(interval = DEFAULT_FETCH_TIMER) {

    return window.setTimeout(() => {
      fetchInventory(userEditingRef.current, updatingRef.current);
    }, interval);
  }

  return (
    <main id="main">
      <Main
        inventory={inventory}
        setItemEditMode={setItemEditMode}
        handleNumericInput={handleNumericInput}
        handleStringInput={handleStringInput}
        handleCancelEdits={handleCancelEdits}
        handleSaveEdits={handleSaveEdits}
        loading={loading}
        updating={updating}
        fetchError={fetchError}
        saving={saving}
        addItemRow={addItemRow}
        removeItemRow={removeItemRow}
        sortItems={sortItems}
      />
    </main>

  );
}
