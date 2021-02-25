import React from 'react'
import * as bs from 'react-bootstrap'
import PreviousPage from './previousPage'
import NextPage from './nextPage'

function PageNav (props) {
    return(
        <bs.Row style={{fontSize: ".5em"}}>
            <PreviousPage pageNum={props.pageNum} previousPage={props.previousPage} myIndex={props.myIndex}/>
            <p style={{padding: "0 10px 0 10px"}}>{props.pageNum} of {props.numPages}</p>
            <NextPage pageNum={props.pageNum} numPages={props.numPages} nextPage={props.nextPage} myIndex={props.myIndex}/>
        </bs.Row>

    )
}

export default PageNav;