import React, { useState, useRef, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa'
import * as RiIcons from 'react-icons/ri';

// https://www.youtube.com/watch?v=mN3P_rv8ad4 Sidebar tutorial

const SidebarLink = styled(Link)`
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 0 10px;
    position: relative;
    height: 40px;
    text-decoration: none;
    font-size: 14px;
    background: black;

    &:hover {
        background: black;
        border-bottom: 8px solid white;
        cursor: pointer;
        color: white;
        text-decoration: none;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 6px;
`;

const DropdownContent = styled.div`
    display: block;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 300px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
`

const DropdownLink = styled(Link)`
    background: #414757;
    height: 60px;
    padding: 5px 1em 0 2em;
    text-decoration: none;
    text-align: left;
    display: block;
    color: #f5f5f5;
    font-size: 14px;

    &:hover {
        background: #2077B0;
        cursor: pointer;
        color: #f5f5f5;
        text-decoration: none;
    }
`


function Submenu(props) {
    const [subnav, setSubnav] = useState(false);
    const dropdownIcon = {
        opened: <RiIcons.RiArrowUpSFill />,
        closed: <RiIcons.RiArrowDownSFill />
    }
    // const wrapperRef = useRef(null);
    // useOutsideAlerter(wrapperRef, subnav);

    let match = useRouteMatch();
    let matchvars = useRouteMatch("/schools/:sid/:did/:type");

    let showSubnav = () => setSubnav(!subnav)
    

    return (
        <div>
            {/* <SidebarLink  onClick={props.subNav && showSubnav}>
                <div>
                    <FaIcons.FaBook />
                    <SidebarLabel>All BYU Colleges</SidebarLabel>
                    
                </div>
            </SidebarLink> */}
            <SidebarLink to={`${match.url}/${props.item.id}/all/${matchvars.params.type}`} onClick={showSubnav}>
                <div>
                    <FaIcons.FaBook />
                    <SidebarLabel>{props.item.name}</SidebarLabel>
                    
                </div>
                <div>
                    {props.item.departments.items && subnav 
                        ? dropdownIcon.opened
                        : props.item.departments.items
                        ? dropdownIcon.closed
                        : null}
                </div>
            </SidebarLink>
            <div style={{position: "relative", display: "inline-block"}}>
                <DropdownContent >
                    {subnav && props.item.departments.items.map((department, index) => {
                        return(
                            <DropdownLink key={index} to={`${match.url}/${props.item.id}/${department.id}/${matchvars.params.type}`} onClick={showSubnav}>
                                <FaIcons.FaBook />
                                <SidebarLabel>{department.name}</SidebarLabel>
                            </DropdownLink>
                        )
                    })
                    }
                </DropdownContent>
                
            </div>
            
        </div>
    )
}

export default Submenu;
