import React from 'react';
import * as bs from 'react-bootstrap'
import './App.css';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Content from './content'
import Header from './header'
import Home from './home'
import Detail from './detail'
import BYUSchools from './byuschools'




export default class App extends React.Component {

  render() {
    return (
      <Router>
        <bs.Container fluid className="p-0 min-vh-100 d-flex flex-column">

          <bs.Row className="flex-grow-0 flex-shrink-0 shadow-sm">
              <bs.Col className="px-8 py-2" style={{ backgroundColor: "#2077B0" }}>
                  <Header />
              </bs.Col>
          </bs.Row>
          <bs.Row className="flex-grow-0 flex-shrink-0 border-bottom shadow-sm">
            <bs.Col className="px-8" >
              <center>
                  <Switch>
                  <Route path="/schools">
                    <div style={{marginTop: "3em"}}>
                      <BYUSchools />
                    </div>
                      
                    </Route>
                    <Route path="/home">
                      <Home />
                    </Route>
                    <Route path="/content">
                      <Content />
                    </Route>

                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
              </center>
            </bs.Col>
          </bs.Row>
  
  
          {/* <AmplifySignOut /> */}
        </bs.Container>
      </Router>
    );
  }

  
}

//export default withAuthenticator(App);