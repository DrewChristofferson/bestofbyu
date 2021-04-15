import React from 'react';
import * as bs from 'react-bootstrap'
import '../styles/App.css';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth, Hub } from 'aws-amplify';

function Login() {
    return(
        <div className="App">
            <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Open Facebook</button>
            <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
            <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
            <button onClick={() => Auth.signOut()}>Sign Out</button>
        </div>
    )
}

export default Login;