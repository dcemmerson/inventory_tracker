import React from 'react';

export function Inventory(props) {

    return (
        <div className="tableContainer">
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
                            return (
                                <tr key={item.data.id} >
                                    <td>{item.data.quantity}</td>
                                    <td>{item.data.name}</td>
                                    <td>{item.data.burnRate}</td>
                                    <td>{item.data.daysLeft}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

