import React from 'react';
import * as bs from 'react-bootstrap'
import styled from 'styled-components'
import '../styles/App.css';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from './header'
import Home from './home'
import About from './about'
import Terms from './Terms'
import Privacy from './Privacy'
import BYUSchools from '../university/byuschools'
import Footer from './footer'
import PageTemplate from '../pages/pagetemplate'
import CreateCategory from '../pages/create/CreateCategory'
import Survey from '../pages/survey/Survey'
import { Auth } from 'aws-amplify'

async function checkUser() {
  const user = await Auth.currentAuthenticatedUser()
  console.log('user: ', user)
}

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <section>
          <div className="page-wrapper">
            <bs.Container fluid className="p-0 d-flex flex-column">
              <bs.Row className="flex-grow-0 flex-shrink-0 shadow-sm">
                  <bs.Col className="px-8 py-2" style={{ backgroundColor: "black" }}>
                      <Header />
                  </bs.Col>
              </bs.Row>
            </bs.Container>
            <div className="content-wrapper">
              {/* <button onClick={() => Auth.federatedSignIn({ provider: 'Google'})}>Sign in with Google</button>
              <button onClick={checkUser}>Check user</button> */}
              <center>
                  <Switch>
                  <Route path="/schools">
                    <div id="main-container">
                      <BYUSchools />    
                    </div>           
                    </Route>
                    <Route path="/category/">
                    <div id="main-container">
                      <PageTemplate />    
                    </div>               
                    </Route>
                    <Route path="/survey">
                      <div style={{marginTop: "3rem"}}>
                        <Survey />
                      </div>
                    </Route>
                    <Route path="/home">
                      <Home />
                    </Route>
                    <Route path="/about">
                      <About />
                    </Route>
                    <Route path="/terms">
                      <Terms />
                    </Route>
                    <Route path="/privacy-policy">
                      <Privacy />
                    </Route>
                    <Route path="/create-category">
                      <CreateCategory />
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
              </center>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </section>
          {/* <AmplifySignOut /> */}
    </Router>
    );
  }
}

//export default withAuthenticator(App);