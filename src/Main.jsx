import React from 'react';
import "react-netlify-identity-widget/styles.css";
import { useIdentityContext } from "react-netlify-identity-widget";

import { Inventory } from "./Inventory.jsx";

// code split the modal til you need it!
const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"))

export function Main() {
  const identity = useIdentityContext()
  const [dialog, setDialog] = React.useState(false)
  const isLoggedIn = identity && identity.isLoggedIn

  return (
    
    <div className="App">
      <button className="btn" onClick={() => setDialog(!isLoggedIn)}>
        {isLoggedIn ? "LOG OUT" : "LOG IN"}
      </button>
      <React.Suspense fallback="loading...">
        <IdentityModal 
        showDialog={dialog}
        onCloseDialog={() => setDialog(false)} 
        />
      </React.Suspense>
      <Inventory />
    </div>
  )
}
