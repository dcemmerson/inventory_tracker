import React, { useState } from "react";
import ReactDOM from "react-dom";

import { useIdentityContext, IdentityContextProvider } from "react-netlify-identity-widget"
import "react-netlify-identity-widget/styles.css"

import { Main } from './Main.jsx';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Root />,
        document.getElementById('root')
    )
});


function Root(props) {
    const url = 'https://wizardly-mayer-95e84a.netlify.app/.netlify/identity'


    return (
        <IdentityContextProvider value={url}>
            <Main />
        </IdentityContextProvider>
    );
}