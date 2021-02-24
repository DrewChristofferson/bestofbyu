import React from 'react';
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'

function SchoolSideBar (props) {
    let match = useRouteMatch();

    const generalEd = 
        {
            "requirements": [ 
                {
                    "id": "ge1",
                    "reqName": "Social Science"

                },
                {
                    "id": "ge2",
                    "reqName": "Physical Science"

                },
                {
                    "id": "ge3",
                    "reqName": "Biological Science"

                },
                {
                    "id": "ge4",
                    "reqName": "Letters"

                },
                {
                    "id": "ge5",
                    "reqName": "Arts"

                },
                {
                    "id": "ge6",
                    "reqName": "Civilization 1"

                },
                {
                    "id": "ge7",
                    "reqName": "Civilization 2"

                },
                {
                    "id": "ge8",
                    "reqName": "Languages of Learning"

                },
                {
                    "id": "ge9",
                    "reqName": "Quantitative Reasoning"

                },
                {
                    "id": "ge10",
                    "reqName": "Adv Written & Oral Communication"

                },
                {
                    "id": "ge11",
                    "reqName": "First-Year Writing"

                },
                {
                    "id": "ge12",
                    "reqName": "Global and Cultural Awareneness"

                },
                {
                    "id": "ge13",
                    "reqName": "American Heritage"

                },
                {
                    "id": "ge14",
                    "reqName": "Religion"

                }
                
            ]
        }
    

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
                <bs.Card>
                    <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey="14">
                        <Link to={`${match.url}/ge/all/courses`}>General Education</Link>
                        </bs.Accordion.Toggle>
                    </bs.Card.Header>
                    <bs.Accordion.Collapse eventKey="14">
                        <bs.Card.Body>
                            {
                                generalEd.requirements.map(requirement => (
                                    
                                    <div key={requirement.id}><Link to={`${match.url}/ge/${requirement.id}/course`}>{requirement.reqName}</Link></div>
                                ))
                            }
                        </bs.Card.Body>
                    </bs.Accordion.Collapse>
                </bs.Card>
            {
                props.colleges.map(college => (
                    
                    <bs.Card key={college.id}>
                        <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey={college.id}>
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