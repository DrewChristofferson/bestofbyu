import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { Link, Redirect, Switch, Router, Route, useRouteMatch } from 'react-router-dom'



function SchoolSideBar (props) {
    let match = useRouteMatch();

    return(
        <bs.Col md="3">   
            <bs.Row className="pl-3 pb-3" style={{textAlign: "center" }}>
                <h1>BYU Academics</h1>
            </bs.Row>                         
            <bs.Accordion style={{paddingTop: "2rem"}}>
                <bs.Card>
                    <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey="0">
                        <Link to={`${match.url}/all/all/professors`}><strong>All BYU Colleges</strong></Link>
                        </bs.Accordion.Toggle>
                    </bs.Card.Header>
                </bs.Card>
            {
                props.colleges.map(college => (
                    
                    <bs.Card key={college.id}>
                        <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey={college.id}>
                            {/* <Link to={`${match.url}/${school.id}/professors`}>{school.name}</Link> */}
                            <Link to={`${match.url}/${college.id}/all/professors`}>{college.name}</Link>
                        </bs.Accordion.Toggle>
                        </bs.Card.Header>
                        <bs.Accordion.Collapse eventKey={college.id}>
                        <bs.Card.Body>
                            {
                                college.departments.items.map(department => (
                                    
                                    <div key={department.id}><Link to={`${match.url}/${college.id}/${department.id}/professors`}>{department.name}</Link></div>
                                ))
                            }
                        </bs.Card.Body>
                        </bs.Accordion.Collapse>
                    </bs.Card>
                
                ))
            }

            </bs.Accordion>
        </bs.Col>
    )
}

export default SchoolSideBar;