/// filename: App.jsx
/// last modified: 07/30/2020
/// description: Top level component which deals with fetching
///   and updating inventory appropriately as well as ensuring
///   user is logged in and not the view of the app.

import React, { useState, useEffect } from 'react';
import { useIdentityContext } from "react-netlify-identity";

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

	/// name: sortItems
	/// arguments: changeToSort - String representing user chosen sort choice.
	/// description: This function is called upon user clicking sort icon
	///   on table header column. Determine which sort method user wants
	///   and sort, then update state. If user already chose to sort by
	///   said column, then
	function sortItems(changeToSort) {
		if (sortBy === changeToSort) {
			setSortAsc(!sortAsc)
		}
		else {
			setSortBy(changeToSort);
			setSortAsc(true);
		}
	}

	/// name: handleNumericInput
	/// arguments:  itemId - db id for item which we are validating input.
	///             e - event stemming from controlled component.
	/// description: Called by controlled component and ensures that user
	///               has indeed entered a number (int or float), by checking
	///               asciii code of character input. Updates state of inventory.
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

	/// name: handleStringInput
	/// arguments:  itemId - db id for item which we are validating input.
	///             e - event stemming from controlled component.
	/// description: Called by controlled component and maintains the state
	///               of item in inventory when being editted.
	function handleStringInput(itemId, e) {
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

	/// name: handleCancelEdits
	/// description: Provide undo functionallity when user is editting
	///   a row in the inventory table.
	function handleCancelEdits() {
		setUserEditing(false);
		setInventory(deepCopy(prevInventory));
	}

	/// name: handleSaveEdits
	/// description: Method is triggered upon user editting a row in
	///   inventory and selecting save. Change the UI to a save mode,
	///   then update inventory in FaunaDB database.
	function handleSaveEdits() {
		setSaving(true);
		setUserEditing(false);

		updateInventory(inventory)
			.then(updatedInventory => {
				setInventory(updatedInventory);
				setPrevInventory(deepCopy(updatedInventory));
				setSaving(false);
			})
	}

	/// name: addItemRow
	/// description: Triggered upon user selecting '+' icon to add
	///   a new item to inventory. This method adds a new element to
	///   inventory list, ensuring item id is kept unique.
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

	/// name: removeItemRow
	/// arguments: id - int representing item id in DB
	/// description: Triggered when user deletes row from inventory
	///   table. This method does not update db, but does update
	///   the inventory state.
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

	/// name: normalizeInventoryData
	/// arguments: inv - array of inventory items
	/// description: After fetching inventory data from db,
	///   calculate the days left for each item, then sort
	///   items based on the current selected sort method.
	function normalizeInventoryData(inv) {
		if (!inv.data) {
			retryFetchInventory(RETRY_REQUEST_WAIT);
			throw new Error(`No inventory.data: ${inv.msg}`);
		}
		inv.data = inv.data.map(item => {
      item.data.quantity = parseFloat(parseFloat(item.data.quantity).toFixed(2));
      item.data.burnRate = parseFloat(parseFloat(item.data.burnRate).toFixed(4));
      item.data.daysLeft = parseFloat(
        (parseFloat(item.data.quantity) / parseFloat(item.data.burnRate)).toFixed(1));
			item.editMode = false;
			return item;
		})
		return inv.data.sort(getSortMethod(sortBy, sortAsc));
	}

	/// name: retryFetchInventory
	/// description: Called if fetch inventory request defers because
	///   user is updating inventory table. This method just ensures we
	///   perform another fetch inventory request in the near future to
	///   ensure this user's inventory stays up to date.
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

	/// name: getInventory
	/// description: Perform actual fetch request to FaunaDB (through
	///   Netlify) for item inventory. Must be logged in for success.
	async function getInventory() {
		if (isLoggedIn) {
      const refreshToken = await identity.getFreshJWT();
			return fetch(`/.netlify/functions/get_inventory`, {
				method: 'GET',
				cache: "no-store",
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				}
			})
				.then(res => res.json())
				.then(results => {
					if (results.loggedIn === false) {
						identity.logoutUser();
						throw new Error(results);
					}
					return results;
				})
				.then(normalizeInventoryData)
				.then(normalizedInventory => {
					setFetchError(false);
					return normalizedInventory;
				})
				.catch(err => {
					console.log(err);
					if (err.loggedIn === false) return;
					setFetchError(true);
				})
		}
		else {
			return [];
		}
	}

	/// name: updateInventory
	/// arguments:  edittedInventory is just inventory list we need
	///               to sync to database.
	/// description: Perform db update request. Must be logged in.
	async function updateInventory(edittedInventory) {
		if (isLoggedIn) {
      const refreshToken = await identity.getFreshJWT();
			return fetch(`/.netlify/functions/update_inventory`, {
				method: 'POST',
				cache: "no-store",
				headers: {
					Authorization: `Bearer ${refreshToken}`,
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

	/// name: fetchInventory
	/// arguments: isUserEditing/isUpdating represent state of inventory table
	///             maintained here in this component.
	/// description: Setup fetch request to FaunaDB (through Netlify) for
	///   item inventory. If using is editing table when this method is called,
	///   we will defer the fetch request.
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
			getInventory()
				.then(inventory => {
					if (inventory.loggedIn === false) { //check for false, not just truthiness.
						identity.logoutUser();
						throw new Error(inventory);
					}
					setInventory(inventory);
					setPrevInventory(deepCopy(inventory));

					setTimer(createFetchTimer());
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

	/// name: createFetchTimer
	/// description: Ensure that this user's inventory table stays
	///   up to date with database, if a separate user makes some
	///   edits. Using a timeout fetch is not the best method here
	///   and can be improved by using observables/streams.
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
