import React, { useState } from 'react';
import * as bs from 'react-bootstrap'
import { useHistory, useRouteMatch } from 'react-router-dom'
import SidebarLink from '../components/sidebarlink'

function SchoolSideBar (props) {
    let match = useRouteMatch();
    let matchvars = useRouteMatch("/schools/:sid/:did/:type");
    let history = useHistory();

    const [selected, setSelected] = useState(`${match.url}/all/all/`)
    const [selectedSubLink, setSelectedSubLink] = useState()
    const SIDEBAR_SELECTED = "sidebarSelected";
    const SIDEBAR_NOTSELECTED = "sidebarNotSelected";


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

    let handleClick = (newSelectedUrl, newSelectedSubUrl) => {
        props.initPageNum();
        if (newSelectedUrl){
            setSelected(newSelectedUrl);
            setSelectedSubLink('');
        } else if(newSelectedSubUrl) {
            setSelectedSubLink(newSelectedSubUrl);
        } else return null;
    }
    
    return(
        <bs.Col md="3">   
            <bs.Row className="pl-3 pb-3" style={{textAlign: "center" }}>
                <h1>BYU Academics</h1>
            </bs.Row>                         
            <bs.Accordion style={{paddingTop: "2rem", textAlign: "center"}}>
                <bs.Card>
                    <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey="0" >
                            <SidebarLink linkUrl={`${match.url}/all/all/${matchvars.params.type}`} compareClassUrl={`${match.url}/all/all/`} selectedLink={selected} handleClick={handleClick} textContent="All BYU Colleges"/>
                        </bs.Accordion.Toggle>
                    </bs.Card.Header>
                </bs.Card>
                <bs.Card>
                    <bs.Card.Header>
                        <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey="14">
                            <SidebarLink linkUrl={`${match.url}/ge/all/${matchvars.params.type}`} compareClassUrl={`${match.url}/ge/all/`} selectedLink={selected} handleClick={handleClick} textContent="General Education"/>
                        </bs.Accordion.Toggle>
                    </bs.Card.Header>
                    <bs.Accordion.Collapse eventKey="14">
                        <bs.Card.Body>
                            {
                                generalEd.requirements.map(requirement => (
                                    
                                    // <div key={requirement.id}><Link to={`${match.url}/ge/${requirement.id}/${matchvars.params.type}`} onClick={() => {props.initPageNum()}}>{requirement.reqName}</Link></div>
                                    <div key={requirement.id}><SidebarLink linkUrl={`${match.url}/ge/${requirement.id}/${matchvars.params.type}`} compareClassUrl={`${match.url}/ge/${requirement.id}/`} selectedSubLink={selectedSubLink} handleClick={handleClick} textContent={requirement.reqName}/></div>
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
                            {/* <Link to={`${match.url}/${college.id}/all/${matchvars.params.type}`} onClick={() => {props.initPageNum()}}>{college.name}</Link> */}
                            <SidebarLink linkUrl={`${match.url}/${college.id}/all/${matchvars.params.type}`} compareClassUrl={`${match.url}/${college.id}/all`} selectedLink={selected} handleClick={handleClick} textContent={college.name}/>
                        </bs.Accordion.Toggle>
                        </bs.Card.Header>
                        <bs.Accordion.Collapse eventKey={college.id}>
                        <bs.Card.Body>
                            {
                                college.departments.items.map(department => (
                                    
                                    // <div key={department.id}><Link to={`${match.url}/${college.id}/${department.id}/${matchvars.params.type}`} onClick={() => {props.initPageNum()}}>{department.name}</Link></div>
                                    <div key={department.id}><SidebarLink linkUrl={`${match.url}/${college.id}/${department.id}/${matchvars.params.type}`} compareClassUrl={`${match.url}/${college.id}/${department.id}`} selectedSubLink={selectedSubLink} handleClick={handleClick} textContent={department.name}/></div>
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