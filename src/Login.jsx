import React, { useState } from 'react';

import "react-netlify-identity-widget/styles.css";
import { useIdentityContext } from "react-netlify-identity";
const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"));

export function Login() {
  const { loginUser, signupUser } = useIdentityContext();

  const [dialog, setDialog] = React.useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isLoggedIn = loginUser && loginUser.isLoggedIn

  function handleInput(e) {
    if (e.target.name === "email") {
      console.log(email);
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      console.log(password);
      setPassword(e.target.value);
    }
  }

  function handleSignup(e) {
    e.preventDefault();
    signupUser(email, password)
      .then(response => {
        console.log("confirmation sent to email " + email);

        console.log(response);

      })
      .catch(err => console.log("Error: ", err))
  }
  return (
    <div className="App">
      <button className="btn" onClick={() => {
        setDialog(isLoggedIn);
        console.log('click');
      }}>
        {isLoggedIn ? "LOG OUT" : "LOG IN"}
      </button>
      <React.Suspense fallback="loading...">
        <IdentityModal
          showDialog={dialog}
          onCloseDialog={() => setDialog(false)}
        />
      </React.Suspense>
    </div>
  );
}
