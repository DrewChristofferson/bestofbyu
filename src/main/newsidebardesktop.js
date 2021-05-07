import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import SubMenu from './submenu'
import generalEd from '../gedata'

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
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

`
const Content = styled.div`
    margin: 4em 0;
`

const FilterSubtitle = styled.p`
    font-style: italic;
`

const SidebarWrap = styled.div`
    width: 20%
`

function NewSideBarDesktop(props) {

    return (
        <div>
            <Content>

            
            <FilterSubtitle>Filter by College, Department, or GE</FilterSubtitle>

            <SidebarNav >
                <SubMenu allColleges={true} key="all" />
                <SubMenu ge={true} key="ge" item={generalEd}/>

                    {
                props.colleges.map((college, index) => (
                    <SubMenu item={college} key={index} />                
                ))
            }
            </SidebarNav>
            </Content>
        </div>
    )
}

export default NewSideBarDesktop;
