import React from 'react';

import "react-netlify-identity-widget/styles.css";
//import { useIdentityContext } from "react-netlify-identity";
const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"));

export function Login(props) {
//  const identity = useIdentityContext()
//  const isLoggedIn = identity && identity.isLoggedIn
  const [dialog, setDialog] = React.useState(!props.loggedIn)

  return (
    <>
      <div className="mt-3 ml-4 loginButtonContainer">
        <button className={"btn btn-sm btn-cust" + (props.loggedIn ? " logout" : "")}
          onClick={() => setDialog(!dialog)}>
          {props.loggedIn ? "LOG OUT" : "LOG IN"}
        </button>
      </div>

      <React.Suspense fallback="loading...">
        <IdentityModal
          showDialog={dialog}
          onCloseDialog={() => setDialog(!dialog)}
          onLogin={() =>{ 
            setDialog(false);
            console.log("logineddd")
          }}
          onSignup={() => console.log("SIGNED UP")}
          onLogout={() => setDialog(true)}
        />
      </React.Suspense>
    </>
  );
}
