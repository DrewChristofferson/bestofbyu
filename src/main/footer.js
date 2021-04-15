import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import { IconContext } from "react-icons";
import { AiFillFacebook } from 'react-icons/ai'
import { AiFillInstagram } from 'react-icons/ai'
import {AiFillYoutube} from 'react-icons/ai'
import {AiOutlineTwitter} from 'react-icons/ai'

const FooterContainer = styled.div`
    background-color: #b5b5b5;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const CopyrightContainer = styled.div`
    padding: 20px 0 10px;
    color: #565656;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    width: 100%;
    font-size: 11px;
`

const CopyrightText = styled.p`
    flexbasis: 50%;
    margin: 0;
`
const IconsContainer = styled.div`
    flexbasis: 20%;
    display: flex;
    justify-content: space-between;
`
const PoliciesContainer = styled.div`
    flexbasis: 30%;
`

const FooterLink = styled(Link)`
    padding: 0 5px;
`

function Footer  () {
    return(
        <FooterContainer>
            <CopyrightContainer>
                <IconsContainer>
                    <IconContext.Provider value={{ color: 'black', size: '16px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiFillFacebook />
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ color: 'black', size: '16px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiFillInstagram />
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ color: 'black', size: '16px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiOutlineTwitter />
                        </div>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ color: 'black', size: '16px', style: { margin: '0 10px' } }}>
                        <div>
                            <AiFillYoutube />
                        </div>
                    </IconContext.Provider>
                </IconsContainer>
                <CopyrightText>
                    &copy; {new Date().getFullYear()} Copyright: Best of BYU
                </CopyrightText>
                <PoliciesContainer>
                    <FooterLink to="/terms">Terms</FooterLink> 
                    <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>      
                </PoliciesContainer>
            </CopyrightContainer>
        </FooterContainer>
            

    )
}

export default Footer;