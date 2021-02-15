import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSchools } from './graphql/queries';
import { Link, Redirect, Switch, Router, Route, useRouteMatch } from 'react-router-dom'
import SchoolTables from './schooltables'
import Detail from './detail'


function BYUSchools() {
    const [schools, setSchools] = useState({});
    let match = useRouteMatch();

    useEffect(() => {
        fetchData();
      }, []);

    async function fetchData() {
        try{ 
        const apiData = await API.graphql({ query: listSchools });
        setSchools(apiData.data.listSchools.items)
        } catch (e) {
            return e;
        }
    }
    
    const myrows = []
    for (let i = 0; i < schools.length; i ++) {
        myrows.push(schools[i])
    }

    return(
        <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{textAlign: "left"}}>
            <Switch>
                <Route path="/schools/:sid/:did/:type/:oid">
                        <Detail />
                </Route>
                <Route path="/schools">

                    <bs.Row className=" pb-5 pl-3 flex-grow-0 flex-shrink-0 border-bottom shadow-sm" >
                        <bs.Col md="3">   
                            <bs.Row className="pl-3 pb-3" style={{borderBottomColor: 'black', borderBottomWidth: 1 }}>
                                <h1>BYU Academics</h1>
                            </bs.Row>                         
                            <bs.Accordion >
                                <bs.Card>
                                    <bs.Card.Header>
                                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey="0">
                                        <Link to={`${match.url}/all/all/professors`}><strong>All BYU Colleges</strong></Link>
                                        </bs.Accordion.Toggle>
                                    </bs.Card.Header>
                                </bs.Card>
                            {
                                myrows.map(school => (
                                    
                                    <bs.Card key={school.id}>
                                        <bs.Card.Header>
                                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey={school.id}>
                                            {/* <Link to={`${match.url}/${school.id}/professors`}>{school.name}</Link> */}
                                            <Link to={`${match.url}/${school.id}/all/professors`}>{school.name}</Link>
                                        </bs.Accordion.Toggle>
                                        </bs.Card.Header>
                                        <bs.Accordion.Collapse eventKey={school.id}>
                                        <bs.Card.Body>
                                            {
                                                school.departments.items.map(department => (
                                                    
                                                    <div key={department.id}><Link to={`${match.url}/${school.id}/${department.id}/professors`}>{department.name}</Link></div>
                                                ))
                                            }
                                        </bs.Card.Body>
                                        </bs.Accordion.Collapse>
                                    </bs.Card>
                                
                                ))
                            }

                            </bs.Accordion>
                        </bs.Col>
                        <bs.Col md="9">

                                <Switch>
                                    <Route path={`${match.path}/:schId/:deptId`}>
                                        <SchoolTables schools={myrows}/>
                                    </Route>
                                    <Route path={match.path}>
                                        <h2>Select a Department</h2>
                                    </Route>
                                </Switch>

                        </bs.Col>
                        
                    </bs.Row>
                </Route>

            </Switch>
        

        </bs.Container>
    )
}

export default withAuthenticator(BYUSchools);