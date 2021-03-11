import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import SubMenu from './submenu'

const Nav = styled.div`
    background: #15171c;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const NavIcon = styled(Link)`
    margin-left: 2em;
    font-size: 2em;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const SidebarNav = styled.nav`
    margin: 4em 0;
    width: 75%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

`

const SidebarWrap = styled.div`
    width: 20%
`

function NewSideBarDesktop(props) {
    // const [sidebar, setSidebar] = useState(false)

    // const showSidebar = () => setSidebar(!sidebar);

    const schools = [
        {
            "name": "All Colleges"
        }
    ]

    const generalEd = 
        {
            "id": "ge",
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
    

    return (
        <div>
            <SidebarNav >
                {/* <SidebarWrap> */}
                <SubMenu allColleges={true} key="all" />
                <SubMenu ge={true} key="ge" item={generalEd}/>

                    {
                props.colleges.map((college, index) => (
                    <SubMenu item={college} key={index} />
                    
                    // <bs.Card key={college.id}>
                    //     <bs.Card.Header>
                    //     <bs.Accordion.Toggle as={bs.Button} variant="link" eventKey={college.id}>
                    //         {/* <Link to={`${match.url}/${college.id}/all/${matchvars.params.type}`} onClick={() => {props.initPageNum()}}>{college.name}</Link> */}
                    //         <SidebarLink linkUrl={`${match.url}/${college.id}/all/${matchvars.params.type}`} compareClassUrl={`${match.url}/${college.id}/all`} selectedLink={selected} handleClick={handleClick} textContent={college.name}/>
                    //     </bs.Accordion.Toggle>
                    //     </bs.Card.Header>
                    //     <bs.Accordion.Collapse eventKey={college.id}>
                    //     <bs.Card.Body>
                    //         {
                    //             college.departments.items.map(department => (
                                    
                    //                 // <div key={department.id}><Link to={`${match.url}/${college.id}/${department.id}/${matchvars.params.type}`} onClick={() => {props.initPageNum()}}>{department.name}</Link></div>
                    //                 <div key={department.id}><SidebarLink linkUrl={`${match.url}/${college.id}/${department.id}/${matchvars.params.type}`} compareClassUrl={`${match.url}/${college.id}/${department.id}`} selectedSubLink={selectedSubLink} handleClick={handleClick} textContent={department.name}/></div>
                    //             ))
                    //         }
                    //     </bs.Card.Body>
                    //     </bs.Accordion.Collapse>
                    // </bs.Card>
                
                ))
            }
                    {/* <SubMenu item="General Education" subNav="yep"/> */}
                {/* </SidebarWrap> */}
            </SidebarNav>
        </div>
    )
}

export default NewSideBarDesktop;
