import React from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

export function Inventory(props) {
    const identity = useIdentityContext();
    const isLoggedIn = identity && identity.isLoggedIn

    let showSaveButton = false;

    return (
        <div className="container">
            <div className={"tableContainer " + (isLoggedIn ? 'd-block' : 'd-none')}>
                <div className="row">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <table>
                            <thead>
                                <tr>
                                    <th className="sort">Qty</th>
                                    <th className="sort">Name</th>
                                    <th className="sort">Burn Rate</th>
                                    <th className="sort">Days Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.inventory.map(item => {
                                        if (item.editMode) {
                                            showSaveButton = true;
                                            return (
                                                <tr key={item.data.id} >
                                                    <td><input name="quantity" value={item.data.quantity}
                                                        onChange={e => props.handleInventoryInput(item.data.id, e)}
                                                    /></td>
                                                    <td><input name="name" value={item.data.name}
                                                        onChange={e => props.handleInventoryInput(item.data.id, e)}
                                                    /></td>
                                                    <td><input name="burnRate" value={item.data.burnRate}
                                                        onChange={e => props.handleInventoryInput(item.data.id, e)}
                                                    /></td>
                                                    <td><input name="daysLeft" value={item.data.daysLeft}
                                                        onChange={e => props.handleInventoryInput(item.data.id, e)}
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
                                <button className={"btn btn-sm btn--save " + (showSaveButton ? "d-block" : "d-none")} onClick={props.addItemRow}>Save</button>
                                <button className={"btn btn-sm btn--cancel " + (showSaveButton ? "d-block" : "d-none")} onClick={props.addItemRow}>Cancel</button>
                            </div>
                            <div className="addItemRow" onClick={props.addItemRow}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

