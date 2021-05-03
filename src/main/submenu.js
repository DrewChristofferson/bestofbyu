import React, { useState, useRef, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa'
import * as RiIcons from 'react-icons/ri';
import DropOnClose from './DropOnClose'

// https://www.youtube.com/watch?v=mN3P_rv8ad4 Sidebar tutorial

const SidebarHeader = styled.div`
    display: flex;
    color: black;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 0 10px 10px 0;
    position: relative;
    height: 40px;
    text-decoration: none;
    font-size: 14px;
    background: #8ab4ce;


    &:hover {

        border-bottom: 4px solid black;
        cursor: pointer;
        color: black;
        text-decoration: none;
    }
`;

const SidebarLink = styled(Link)`
    display: flex;
    color: black;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 0 10px 10px 0;
    position: relative;
    height: 40px;
    text-decoration: none;
    font-size: 14px;
    background: #8ab4ce;


    &:hover {

        border-bottom: 4px solid black;
        cursor: pointer;
        color: black;
        text-decoration: none;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 6px;
`;

const DropdownContent = styled.div`
    display: block;
    position: absolute;
    top: 40px;
    left: 0;
    background-color: #f1f1f1;
    min-width: 300px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
`

const DropdownLink = styled(Link)`
    background: #414757;
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    text-decoration: none;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    let match = useRouteMatch("/:cat/:sid/:did/:type");
    let showSubnav = () => setSubnav(!subnav)

    let getAllDept = () => {
        console.log(props.item)
        if(!props.ge){
            return(
                <DropdownLink key="all" to={`/${match.params.cat}/${props.item.id}/all/${match.params.type}`} onClick={showSubnav}>
                    {/* <FaIcons.FaBook /> */}
                    <SidebarLabel>All Departments</SidebarLabel>
                </DropdownLink>
            )
            
        } else if (props.ge){
            return(
                <DropdownLink key="all" to={`/${match.params.cat}/${props.item.id}/all/${match.params.type}`} onClick={showSubnav}>
                    {/* <FaIcons.FaBook /> */}
                    <SidebarLabel>All Requirements</SidebarLabel>
                </DropdownLink>
                )
        }
    }


    if (props.allColleges) {
        return(
            <SidebarLink to={`/schools/all/all/${match.params.type}`}>
                <div>
                    {/* <FaIcons.FaBook /> */}
                    <SidebarLabel>All Colleges</SidebarLabel>
                    
                </div>
            </SidebarLink>
        )
    } else if (props.ge) {
        return (
            <div style={{position: "relative", display: "inline-block"}}>
                {/* <SidebarLink to={`/${match.url}/all/all/${match.params.type}`} >
                    <div>
                        <FaIcons.FaBook />
                        <SidebarLabel>Show All</SidebarLabel>
                        
                    </div>
                </SidebarLink> */}
                <SidebarHeader onClick={showSubnav}>
                    <div>
                        {/* <FaIcons.FaBook /> */}
                        <SidebarLabel>General Education</SidebarLabel>
                        
                    </div>
                    <div>
                        {props.item && subnav 
                            ? dropdownIcon.opened
                            : props.item
                            ? dropdownIcon.closed
                            : null}
                    </div>
                </SidebarHeader>
                <div >
                    {
                        subnav && (
                            <DropOnClose onClose={() => {
                                setSubnav(false)
                              }}>
                                <DropdownContent onClose={() => {
                                    setSubnav(false)
                                }}>
                                    {getAllDept()} 
                                    {props.item.requirements.map((requirement, index) => {
                                        return(
                                            <DropdownLink 
                                                key={index} 
                                                to={`/${match.params.cat}/${props.item.id}/${requirement.id}/${match.params.type}`} 
                                                onClick={showSubnav}
                                            >
                                                {/* <FaIcons.FaBook /> */}
                                                <SidebarLabel>{requirement.reqName}</SidebarLabel>
                                            </DropdownLink>
                                        )
                                    })
                                    }
                                </DropdownContent>
                            </DropOnClose>
                        )
                    }
                    
                    
                </div>
                
            </div>
        )
    }else {
        return (
            <div style={{position: "relative", display: "inline-block"}}>
                {/* <SidebarLink to={`${match.url}/all/all/${match.params.type}`} >
                    <div>
                        <FaIcons.FaBook />
                        <SidebarLabel>Show All</SidebarLabel>
                        
                    </div>
                </SidebarLink> */}
                <SidebarHeader onClick={showSubnav}>
                    <div>
                        {/* <FaIcons.FaBook /> */}
                        <SidebarLabel>{props.item.name}</SidebarLabel>
                        
                    </div>
                    <div>
                        {props.item.departments.items && subnav 
                            ? dropdownIcon.opened
                            : props.item.departments.items
                            ? dropdownIcon.closed
                            : null}
                    </div>
                </SidebarHeader>
                <div >
                    {
                        subnav && (
                            <DropOnClose onClose={() => {
                                setSubnav(false)
                              }}>
                                <DropdownContent >
                                    {getAllDept()} 
                                    {props.item.departments.items.map((department, index) => {
                                        return(
                                            <DropdownLink key={index} to={`/${match.params.cat}/${props.item.id}/${department.id}/${match.params.type}`} onClick={showSubnav}>
                                                {/* <FaIcons.FaBook /> */}
                                                <SidebarLabel>{department.name}</SidebarLabel>
                                            </DropdownLink>
                                        )
                                    })
                                    }
                                </DropdownContent> 
                            </DropOnClose>
                        )
                    }
                </div>
            </div>
        )
    }

    
}

export default Submenu;
