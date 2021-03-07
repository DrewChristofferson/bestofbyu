import React, { useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa'
import * as RiIcons from 'react-icons/ri';

// https://www.youtube.com/watch?v=mN3P_rv8ad4 Sidebar tutorial

const SidebarLink = styled(Link)`
    display: flex;
    color: white;
    height: 20px;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    list-style: none;
    height: 60px;
    text-decoration: none;
    font-size: 18px;

    &:hover {
        background: #252831;
        border-left: 4px solid #632ce4;
        cursor: pointer;
        color: white;
        text-decoration: none;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 16px;
`;

const DropdownLink = styled(Link)`
    background: #414757;
    height: 60px;
    padding-left: 3em;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #f5f5f5;
    font-size: 18px;

    &:hover {
        background: #632ce4;
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

    let match = useRouteMatch();
    let matchvars = useRouteMatch("/schools/:sid/:did/:type");

    let showSubnav = () => setSubnav(!subnav)
    console.log(props.item)

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
            {subnav && props.item.departments.items.map((department, index) => {
                return(
<               DropdownLink key={index} to={`${match.url}/${props.item.id}/${department.id}/${matchvars.params.type}`}>
                    <FaIcons.FaBook />
                    <SidebarLabel>{department.name}</SidebarLabel>
                </DropdownLink>
                )
            })
            }
        </div>
    )
}

export default Submenu;
