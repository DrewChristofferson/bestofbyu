import React from 'react'
import * as bs from 'react-bootstrap'

function Footer  () {
    return(
        <bs.Container style={{backgroundColor: "#2077B0", height: "5em", color: "white"}} className={"py-2"} fluid>
            <bs.Row style={{textAlign: "auto"}}>
                {/* <p>&copy; {new Date().getFullYear()} Copyright: Best of BYU</p> */}
            </bs.Row>
        </bs.Container>
    )
}

export default Footer;