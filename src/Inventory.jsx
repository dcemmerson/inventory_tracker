import React from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

export function Inventory(props) {
    const identity = useIdentityContext();
    const isLoggedIn = identity && identity.isLoggedIn;

    let showSaveButton = false;
    let itemInLimbo = false;

    function addSwipeGestures() {
        import('tinygesture').then(TinyGesture => {
            const trs = document.getElementsByTagName('tr');
            Object.values(trs).forEach(tr => {
                const gesture = new TinyGesture(tr);
                gesture.on('swipeleft', e => {
                    let test = document.getElementsByTagName('table');
                    test.setAttribute('style', 'display:none');
                });
            });
        })

    }

    return (
        <div className="container-fluid">
            <div className={"tableContainer " + (isLoggedIn ? 'd-block' : 'd-none')}>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="d-flex">
                            <div className={"tableCover" + ((props.loading || props.updating) ? " w-100" : " w-0")}></div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Qty<span className="sort"
                                            onClick={() => props.sortItems("byQuantity")}></span></th>
                                        <th>Name<span className="sort"
                                            onClick={() => props.sortItems("byName")}></span></th>
                                        <th>Burn Rate<span className="sort"
                                            onClick={() => props.sortItems("byBurnRate")}></span></th>
                                        <th>Days Left<span className="sort"
                                            onClick={() => props.sortItems("byDaysLeft")}></span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.inventory.map(item => {
                                            if (item.deleteItem) {
                                                itemInLimbo = true;
                                            }
                                            if (item.editMode) {
                                                showSaveButton = true;
                                                return (
                                                    <tr key={item.data.id} className={item.deleteItem ? "deletedRow" : ""}>
                                                        <td><span className="deleteItemRow" onClick={() => props.removeItemRow(item.data.id)}></span>
                                                            <input name="quantity" value={item.data.quantity} type="number"
                                                                onChange={e => props.handleNumericInput(item.data.id, e)}
                                                            /></td>
                                                        <td><input name="name" value={item.data.name} type="text"
                                                            onChange={e => props.handleStringInput(item.data.id, e)}
                                                        /></td>
                                                        <td><input name="burnRate" value={item.data.burnRate} type="number"
                                                            onChange={e => props.handleNumericInput(item.data.id, e)}
                                                        /></td>
                                                        <td><input name="daysLeft" value={item.data.daysLeft} disabled={true} type="number"
                                                        /></td>
                                                    </tr>
                                                );
                                            }
                                            else {
                                                return (
                                                    <tr key={item.data.id} className={item.deleteItem ? "deletedRow" : ""}
                                                        onClick={() => props.setItemEditMode(item.data.id)}

                                                    >
                                                        <td>{item.data.quantity}</td>
                                                        <td>{item.data.name}</td>
                                                        <td>{item.data.burnRate}</td>
                                                        <td>{item.data.daysLeft}</td>
                                                    </tr>
                                                );
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="row justify-content-between">
                            <div role="group" className="btn-group my-3 ml-4">
                                <button className={"btn btn-sm btn--save mx-2"
                                    + (itemInLimbo ? " userActionRequired" : "")
                                    + ((showSaveButton || itemInLimbo) ? " d-block" : " d-none")}
                                    onClick={props.handleSaveEdits}>Save</button>
                                <button className={"btn btn-sm btn--cancel mx-2"
                                    + (itemInLimbo ? " userActionRequired" : "")
                                    + ((showSaveButton || itemInLimbo) ? " d-block" : " d-none")}
                                    onClick={props.handleCancelEdits}>Cancel</button>
                                <div className={"spinner-border text-secondary spinner-sm " + (props.loading || props.updating ? "d-block" : "d-none")}></div>
                            </div>
                            <div className="addItemRow mr-4 mt-2" onClick={props.addItemRow}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

