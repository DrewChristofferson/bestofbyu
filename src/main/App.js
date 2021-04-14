import React from 'react';
import * as bs from 'react-bootstrap'
import '../styles/App.css';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Content from '../content'
import Header from './header'
import Home from './home'
import About from './about'
import Detail from '../university/detail'
import CreateCategory from './createcategory.js'
import BYUSchools from '../university/byuschools'
import Footer from './footer'
import PageTemplate from '../pages/pagetemplate'
import CreateCatName from './CreateCatName'




export default class App extends React.Component {

  render() {
    return (
      <Router>
        <bs.Container fluid className="p-0 d-flex flex-column">

          <bs.Row className="flex-grow-0 flex-shrink-0 shadow-sm">
              <bs.Col className="px-8 py-2" style={{ backgroundColor: "#2077B0" }}>
                  <Header />
              </bs.Col>
          </bs.Row>
        </bs.Container>
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
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/create-category/name">
                <CreateCatName />
              </Route>
              <Route path="/create-category">
                <CreateCatName />
              </Route>
              

              <Route path="/">
                <Home />
              </Route>
            </Switch>
          
        </center>
        
      {/* <Footer /> */}
          {/* <AmplifySignOut /> */}
    </Router>
    );
  }

  
}

//export default withAuthenticator(App);