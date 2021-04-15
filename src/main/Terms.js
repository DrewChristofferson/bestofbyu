import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'

const AboutContainer = styled.div`
    @media (max-width: 799px){
        margin: 5rem 5rem;
    }
    @media (max-width: 1199px){
        margin: 5rem 10rem;
    }
    @media (min-width: 1200px){
        margin: 5rem 20rem;
    }
    
    display: flex;
    flex-direction: column;
    align-items: flex-start;

`
const AboutHeader = styled.h2`
    padding-bottom: 20px;
`

function Terms() {
    const match = useRouteMatch();
    return (
        <AboutContainer>
            <AboutHeader>Terms and Conditions</AboutHeader>
        </AboutContainer>
    )
}

export default Terms
