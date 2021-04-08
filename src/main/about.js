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

const AboutContent = styled.p`
    line-height: 2;
    text-align: left;
`
const Signature = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
`
const SignatureName = styled.p`
    line-height: 2;
    text-align: left;
    font-weight: bold;
`

function About() {
    const match = useRouteMatch();
    return (
        <AboutContainer>
            <AboutHeader>Hello Friends!</AboutHeader>
            <AboutContent>
                I created the Best of BYU platform because I found myself always Googling "What is the best..."
                For example, go ahead and search "Best Date Ideas" and you will find a plethora of results. Google even
                does a great job of providing local results for you. However, the frusterating thing is that almost 
                every result is a blog post with one person's opinion -- usually bad opinion I might add. I wanted
                to find the top ideas across all my peers. Yes, I could post a poll on social media, but those results 
                can't be distributed to all of us. I decided to build a platform -- not the Yelp of this or the Rotten 
                Tomatoes of that -- but a true crowd-sourced ratings platform of categories created by YOU! The category
                can be anything from Best Fantasy Novels to Best Stocks to Invest in This Year. 
            </AboutContent>
            <AboutContent>
                This platform is built primarily for BYU students. Our team has built two special categories with extra
                functionality to help students plan out their academic schedules: <Link to="/schools/all/all/courses">BYU Courses </Link> 
                and <Link to="/schools/all/all/professors">BYU Professors</Link>. I think you'll find that it is much better than 
                RateMyProfessor.
            </AboutContent>
            <AboutContent>
                We are still building the platform and please be patient if you run into any bumps along the way. We love 
                feedback! You can post any feedback on our feedback page. If you want to send a more personal message, 
                please shoot me an email at <a href="mailto:info.bestofbyu@gmail.com">info.bestofbyu@gmail.com </a>   
                and I'll try to respond as soon as I can. Thanks for trying out the platform. Please share your favorite category on social media!
            </AboutContent>
            <Signature>
                <AboutContent>Cheers!</AboutContent>
                <AboutContent>Drew Christofferson</AboutContent>
                <AboutContent>Founder</AboutContent> 
            </Signature>
            <div class="fb-share-button" 
                data-href="https://master.d31xdmjzvsaw7v.amplifyapp.com/about"
                data-layout="button_count">
            </div>
            
        </AboutContainer>
    )
}

export default About
