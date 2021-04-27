import React, { useState, useEffect, useContext } from 'react'
import AppContext from '../context/context'
import { Auth } from 'aws-amplify';
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AmplifySignOut, AmplifySignInButton } from '@aws-amplify/ui-react'

function Header() {
    const context = useContext(AppContext)

    useEffect(() => {
        // console.log(context.user)
        console.log(context?.user?.attributes?.email)
    })

    let createNavDropdown = () => {
        console.log(context?.user?.attributes?.email)
        if(context?.user?.attributes?.email){
            return(
                <bs.Nav>
                <bs.NavDropdown title={context?.user?.attributes?.email} id="basic-nav-dropdown">
                    <bs.NavDropdown.Item href="#action/3.1">Settings</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item href="#action/3.2">Account</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item href="#action/3.3">Support</bs.NavDropdown.Item>
                    <bs.NavDropdown.Divider />
                    <bs.NavDropdown.Item onClick={() => Auth.signOut()}>Sign Out</bs.NavDropdown.Item>
                    {/* <button onClick={() => Auth.signOut()}>Sign Out</button> */}
                    {/* <bs.NavDropdown.Item href="#action/3.4">< AmplifySignOut /> </bs.NavDropdown.Item> */}
                </bs.NavDropdown>
            </bs.Nav>
            )
        } else {
            //TODO: change size
            return (
                <button onClick={() => Auth.federatedSignIn({ provider: 'Google'})}>Sign In</button>
                // <AmplifySignInButton>Sign In</AmplifySignInButton> 
            );
        }
    }

    return (
            <bs.Navbar variant="dark" expand="lg">
                <Link to="/">
                    <bs.Navbar.Brand> 
                        {/* <img alt="logo" src={cougarslogo} height="80px" className="mx-2"/>  */}
                        VIZOR
                    </bs.Navbar.Brand>
                </Link>
                <bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <bs.Navbar.Collapse id="basic-navbar-nav">
                    <bs.Nav className="mr-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/my-categories" className="nav-link">My Categories</Link>
                        <Link to="/saved" className="nav-link">Saved</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/category/3341a7ca-350f-4454-b84b-49ca9430940f" className="nav-link">Feedback</Link>
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