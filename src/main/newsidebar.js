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
    background: #15171c;
    width: 450px;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
    transition: 350ms;
    z-index: 10;
`

const SidebarWrap = styled.div`
    width: 100%
`

function NewSideBar(props) {
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div>
            <Nav>
                <NavIcon to="#">
                    <FaIcons.FaBars onClick={showSidebar}/>
                </NavIcon>
            </Nav>
            <SidebarNav sidebar={sidebar}>
                <SidebarWrap>
                    <NavIcon to='#'>
                        <AiIcons.AiOutlineClose onClick={showSidebar} />
                    </NavIcon>
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
                </SidebarWrap>
            </SidebarNav>
        </div>
    )
}

export default NewSideBar
