/// filename: Inventory.jsx
///	last modified: 07/30/2020
///	description: Stateless component that provides rendering
///		logic for actual inventory tracking table.

import React from 'react';
import { useIdentityContext } from "react-netlify-identity";

export function Inventory(props) {
  const ELEVEN = 11;
  const TWENTYONE = 21;

	const identity = useIdentityContext();
	const isLoggedIn = identity && identity.isLoggedIn;

	let showSaveButton = false;
	let itemInLimbo = false;

	return (
		<div className="container-fluid">
			<div className={"tableContainer my-2 my-md-3 my-lg-5 " + (isLoggedIn ? 'd-block' : 'd-none')}>
				<div className="row justify-content-center">
					<div className="col-12 col-lg-10 col-xl-8">
						<div className="d-flex">
							<div className={"tableCover" + ((props.loading || props.saving) ? " w-100" : " w-0")}></div>
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
                      console.log('qty: ' + item.data.quantity);
                      console.log('daysLeft: ' + item.data.daysLeft);

											if (item.deleteItem) {
												itemInLimbo = true;
											}
											if (item.editMode) {
												showSaveButton = true;
												return (
                          <tr key={item.data.id} className={
                            item.deleteItem ? "deletedRow"
                          : item.data.daysLeft < ELEVEN ? "tenOrLessDays"
                          : item.data.daysLeft < TWENTYONE ? "twentyOrLessDays"
                          : ""}>
														<td><span className="deleteItemRow" onClick={() => props.removeItemRow(item.data.id)}></span>
															<input className="input" name="quantity" value={item.data.quantity} type="number"
																onChange={e => props.handleNumericInput(item.data.id, e)}
															/></td>
														<td><input className="input" name="name" value={item.data.name} type="text"
															onChange={e => props.handleStringInput(item.data.id, e)}
														/></td>
														<td><input className="input" name="burnRate" value={item.data.burnRate} type="number"
															onChange={e => props.handleNumericInput(item.data.id, e)}
														/></td>
														<td>
															<input className="input daysLeft" name="daysLeft" value={item.data.daysLeft}
																disabled={true} type="number" />
														</td>
													</tr>
												);
											}
											else {
												return (
                          <tr key={item.data.id} className={
                              item.deleteItem ? "deletedRow"
                            : item.data.daysLeft < ELEVEN ? "tenOrLessDays"
                            : item.data.daysLeft < TWENTYONE ? "twentyOrLessDays"
                            : ""}
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
								<button className={"btn btn-sm btn-cust mx-2"
									+ (itemInLimbo ? " userActionRequired" : "")
									+ ((showSaveButton || itemInLimbo) ? " d-block" : " d-none")}
									onClick={props.handleSaveEdits}>Save</button>
								<button className={"btn btn-sm btn-cust mx-2"
									+ (itemInLimbo ? " userActionRequired" : "")
									+ ((showSaveButton || itemInLimbo) ? " d-block" : " d-none")}
									onClick={props.handleCancelEdits}>Cancel</button>
								<div className={"spinner-border text-secondary spinner-sm " + (props.loading || props.updating ? "d-block" : "d-none")}></div>
							</div>
							<div className={(props.fetchError ? "d-block" : "d-none")}>Unable to update inventory. <a href="/">Refresh page</a></div>
							<div className="addItemRow mr-4 mt-2" onClick={props.addItemRow}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
