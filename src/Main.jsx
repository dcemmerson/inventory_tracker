import React from 'react';
import "react-netlify-identity-widget/styles.css";
import { useIdentityContext } from "react-netlify-identity-widget";
//import { netlifyIdentity } from "react-netlify-identity";

import { Inventory } from "./Inventory.jsx";
import { Login } from "./Login.jsx";

export function Main(props) {
  const identity = useIdentityContext()
  const isLoggedIn = identity && identity.isLoggedIn

  return (
    <>
      <Login 
        setLoggedIn={props.setLoggedIn}
      />
      <Inventory
        inventory={props.inventory}
        setItemEditMode={props.setItemEditMode}
        handleItemInput={props.handleItemInput}
      />
    </>
  );
}
