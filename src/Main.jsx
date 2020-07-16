import React from 'react';
//import "react-netlify-identity-widget/styles.css";
//import { useIdentityContext } from "react-netlify-identity-widget";
//import { netlifyIdentity } from "react-netlify-identity";

import { Inventory } from "./Inventory.jsx";
import { Login } from "./Login.jsx";
import { LoadMessage } from "./LoadMessage.jsx";


export function Main(props) {
  //  const identity = props.loggedIn;//useIdentityContext()
  const isLoggedIn = props.loggedIn;//identity && identity.isLoggedIn

  function loadingView() {
    return (
      <>
        <Login
          loggedIn={props.loggedIn}
        />
        <LoadMessage />
      </>
    );
  }

  function loginView() {
    return (
      <Login
        loggedIn={props.loggedIn}
      />
    );
  }

  function loadedView() {
    return (
      <>
        <Login
          loggedIn={props.loggedIn}
        />
        <Inventory
          inventory={props.inventory}
          setItemEditMode={props.setItemEditMode}
          handleNumericInput={props.handleNumericInput}
          handleStringInput={props.handleStringInput}
          handleCancelEdits={props.handleCancelEdits}
          handleSaveEdits={props.handleSaveEdits}
          loading={props.loading}
          updating={props.updating}
          fetchError={props.fetchError}
          saving={props.saving}
          addItemRow={props.addItemRow}
          removeItemRow={props.removeItemRow}
          sortItems={props.sortItems}
        />
      </>
    );
  }
  if (!isLoggedIn) {
    return loginView();
  }
  else if (props.loading) {
    return loadingView();

  }
  else {
    return loadedView();
  }

}
