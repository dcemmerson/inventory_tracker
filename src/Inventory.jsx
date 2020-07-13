import React from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";

export function Inventory(props) {
    const identity = useIdentityContext();
    const isLoggedIn = identity && identity.isLoggedIn

    return (
        <div className={"tableContainer " + (isLoggedIn ? 'd-flex' : 'd-none')}>
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
                                return (
                                    <tr key={item.data.id} >
                                        <td><input name="quantity" value={item.data.quantity} /></td>
                                        <td><input name="name" value={item.data.name} /></td>
                                        <td><input name="burnRate" value={item.data.burnRate} /></td>
                                        <td><input name="daysLeft" value={item.data.daysLeft} /></td>
                                    </tr>
                                );
                            }
                            else {
                                return (
                                    <tr key={item.data.id} onClick={() => props.setInventoryEditMode(item.data.id)}>
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
    );


}

