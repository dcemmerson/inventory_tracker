/// filename: LoaMessage.jsx
///	last modified: 07/30/2020
///	description: Stateful component that provides fallback
///		widget to display on screen while database info is being
///		loaded.

import React, { useState } from 'react';

import { useIdentityContext } from "react-netlify-identity";
import './scss/login.scss';


export function Login(props) {
  const identity = useIdentityContext();
  const isLoggedIn = identity && identity.isLoggedIn;
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [invalidLogin, setInvalidLogin] = useState({ error: false, message: "" });
  const [invalidSignUp, setInvalidSignUp] = useState({ error: false, message: "" });

  function submitLogin(e) {
    e.preventDefault();
    e.target.disabled = true;
    e.persist();
    setSubmitting(true);

    identity.loginUser(loginEmail, loginPassword, true)
      .then(results => {
        setInvalidSignUp({ error: false, message: "" });
        setInvalidLogin({ error: false, message: "" });
        // eslint-disable-next-line no-undef
        $('#loginModal').modal('hide');
      })
      .catch(err => {
        setInvalidLogin({ error: true, message: err.message });
        console.log(err);
      })
      .finally(() => {
        e.target.disabled = false;
        setSubmitting(false);
      })
  }

  function submitSignUp(e) {
    e.preventDefault();
    e.target.disabled = true;
    e.persist();

    setSubmitting(true);

    identity.signupUser(signUpEmail, signUpPassword, { name: signUpName }, false)
      .then(results => identity.loginUser(signUpEmail, signUpPassword, true))
      .then(results => {
        setSubmitting(false);
        setInvalidSignUp({ error: false, message: "" });
        setInvalidLogin({ error: false, message: "" });
      })
      .catch(err => {
        setInvalidSignUp({ error: true, message: err.message });
        console.log(err);
      })
      .finally(() => {
        e.target.disabled = false;
        setSubmitting(false);
      })
  }

  function handleInput(e) {
    const target = e.target;
    if (target.name === "signUpName") {
      setSignUpName(target.value);
    }
    else if (target.name === "signUpEmail") {
      setSignUpEmail(target.value);
    }
    else if (target.name === "signUpPassword") {
      setSignUpPassword(target.value);

    }
    else if (target.name === "loginEmail") {
      setLoginEmail(target.value);
    }
    else if (target.name === "loginPassword") {
      setLoginPassword(target.value);

    }
  }

  function logout(e) {
    e.preventDefault();
    e.target.disabled = true;
    setSubmitting(true);

    identity.logoutUser()
      .then(results => {
        console.log(results);
        setSubmitting(false);
      })
  }

  function loginOptions() {
    return (
      <>
        <div className="mt-3 ml-4 loginButtonContainer">
          <button className={"btn btn-sm btn-cust opacity0" + (props.loggedIn ? " logout" : "")}
            data-toggle="modal" data-target="#loginModal">
            {isLoggedIn ? "LOG OUT" : "LOG IN"}
          </button>
        </div>
        <div id="loginModal" className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="login-tab" data-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="signUp-tab" data-toggle="tab" href="#signUp" role="tab" aria-controls="signUp" aria-selected="false">Sign Up</a>
                  </li>
                </ul>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
                    <div className={"alert alert-danger" + (invalidLogin.error ? " d-block" : " d-none")}>{invalidLogin.message}</div>
                    <div>DEMO VERSION - use test@test.com/password</div>
                    <form>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text emailIcon"></span>
                        </div>
                        <input name="loginEmail" type="email" id="email" className="form-control" placeholder="Email"
                          value={loginEmail} onChange={handleInput} />
                      </div>
                      <label htmlFor="password" className="sr-only">Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text lockIcon"></span>
                        </div>
                        <input name="loginPassword" type="password" id="password" className="form-control" placeholder="Password"
                          value={loginPassword} onChange={handleInput} />
                      </div>
                      <div className="modal-footer">
                        <button type="submit" id="submitLogin" className="btn btn-block btn-dark"
                          onClick={submitLogin}>Login
                          <span className={"spinner-sm ml-2" + (submitting ? " spinner-border text-secondary" : "")}></span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="signUp" role="tabpanel" aria-labelledby="signUp-tab">
                    <div className={"alert alert-danger" + (invalidSignUp.error ? " d-block" : " d-none")}>{invalidSignUp.message}</div>
                    <div>DEMO VERSION - sign up disabled</div>
                    <form>
                      <label htmlFor="name" className="sr-only">Name</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text userIcon"></span>
                        </div>
                        <input name="signUpName" type="name" id="name" className="form-control" placeholder="Name"
                          value={signUpName} onChange={handleInput} />
                      </div>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text emailIcon"></span>
                        </div>
                        <input name="signUpEmail" type="email" id="email" className="form-control" placeholder="Email"
                          value={signUpEmail} onChange={handleInput} />
                      </div>
                      <label htmlFor="password" className="sr-only" >Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text lockIcon"></span>
                        </div>
                        <input name="signUpPassword" type="password" id="password" className="form-control" placeholder="Password"
                          value={signUpPassword} onChange={handleInput} />
                      </div>
                      <div className="modal-footer">
                        <button type="submit" id="submitSignUp" className="btn btn-block btn-dark"
                          onClick={submitSignUp}>Sign up!
                          <span className={"spinner-sm ml-2" + (submitting ? " spinner-border text-secondary" : "")}></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function logoutOptions() {
    return (
      <>
        <div className="mt-3 ml-4 loginButtonContainer">
          <button className={"btn btn-sm btn-cust" + (isLoggedIn ? " logout" : "")}
            data-toggle="modal" data-target="#loginModal">
            {isLoggedIn ? "LOG OUT" : "LOG IN"}
          </button>
        </div>
        <div id="loginModal" className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="h5">Logged in as {identity.user.email}</h2>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <button type="submit" id="submitLogin" className="btn btn-block btn-dark"
                    onClick={logout}>Logout
                          <span className={"spinner-sm ml-2" + (submitting ? " spinner-border text-secondary" : "")}></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  setTimeout(() => {
    if(props.loggedIn === false) {
      console.log('calling modal show');
      $('#loginModal').modal('show');
    }
  }, 30);
  if (isLoggedIn) {
    return logoutOptions();
  }
  else {
    return loginOptions();
  }

}
