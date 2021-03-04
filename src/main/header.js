import React, { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify';
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AmplifySignOut, AmplifySignInButton } from '@aws-amplify/ui-react'

function Header() {
    const [userEmail, setUserEmail] = useState(null);
    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then (user => {
            setUserEmail(user.attributes.email)
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        createNavDropdown();
    });

    let createNavDropdown = () => {
        if(userEmail){
            return(
                <bs.Nav>
                <bs.NavDropdown title={userEmail} id="basic-nav-dropdown">
                    <bs.NavDropdown.Item href="#action/3.1">Settings</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item href="#action/3.2">Account</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item href="#action/3.3">Support</bs.NavDropdown.Item>
                    <bs.NavDropdown.Divider />
                    <bs.NavDropdown.Item href="#action/3.4">< AmplifySignOut /> </bs.NavDropdown.Item>
                </bs.NavDropdown>
            </bs.Nav>
            )
        } else {
            return;
        }

    }

    return (
            <bs.Navbar variant="dark" expand="lg">
                <Link to="/">
                    <bs.Navbar.Brand> 
                        {/* <img alt="logo" src={cougarslogo} height="80px" className="mx-2"/>  */}
                        Best of BYU
                    </bs.Navbar.Brand>
                </Link>
                <bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <bs.Navbar.Collapse id="basic-navbar-nav">
                    <bs.Nav className="mr-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/" className="nav-link">About</Link>
                        <Link to="/" className="nav-link">Feedback</Link>
                        {/* <AmplifySignInButton theme={myTheme}>Sign In</AmplifySignInButton> */}
                        {/* <AmplifySignInButton >Sign In</AmplifySignInButton> */}
                        
                    </bs.Nav>
                    <bs.Nav>
                        <Link to="/cart" className="nav-link"> <i className="fas fa-shopping-cart"> </i> </Link>
                    </bs.Nav>
                    {createNavDropdown()}
                </bs.Navbar.Collapse>
            </bs.Navbar>
    )
}

export default Header;