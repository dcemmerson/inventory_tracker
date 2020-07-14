import React from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

export function Inventory(props) {
    const identity = useIdentityContext();
    const isLoggedIn = identity && identity.isLoggedIn;

    const filteredInventory = props.inventory.filter(item => !item.deleteItem ? item : null);

    let showSaveButton = false;


    return (
        <div className="container-fluid">
            <div className={"tableContainer " + (isLoggedIn ? 'd-block' : 'd-none')}>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <table>
                            <thead>
                                <tr>
                                    <th>Qty<span className="sort"></span></th>
                                    <th>Name<span className="sort"></span></th>
                                    <th>Burn Rate<span className="sort"></span></th>
                                    <th>Days Left<span className="sort"></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredInventory.map(item => {
                                        if (item.editMode) {
                                            showSaveButton = true;
                                            return (
                                                <tr key={item.data.id} >
                                                    <td><input name="quantity" value={item.data.quantity} type="number"
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
                                                <tr key={item.data.id} onClick={() => props.setItemEditMode(item.data.id)}>
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
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="row justify-content-between">
                            <div className="btn-group" role="group">
                                <button className={"btn btn-sm btn--save " + (showSaveButton ? "d-block" : "d-none")} onClick={props.handleSaveEdits}>Save</button>
                                <button className={"btn btn-sm btn--cancel " + (showSaveButton ? "d-block" : "d-none")} onClick={props.handleCancelEdits}>Cancel</button>
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

