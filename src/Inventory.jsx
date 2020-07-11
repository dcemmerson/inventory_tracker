import React from 'react';

export function Inventory(props) {

    return (
        <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        <th>Qty</th>
                        <th>Name</th>
                        <th>Burn Rate</th>
                        <th>Days Left</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>csa</td>
                        <td>0.25</td>
                        <td>4</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

