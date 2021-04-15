import React from 'react'
import * as bs from 'react-bootstrap'
import PreviousPage from './previousPage'
import NextPage from './nextPage'

function PageNav (props) {
    return(
        <div>
            <div className="pageNav">
                <PreviousPage pageNum={props.pageNum} previousPage={props.previousPage} myIndex={props.myIndex}/>
            </div>
            <div className="pageNav">
                <p style={{padding: "0 10px 0 10px"}}>{props.pageNum} of {props.numPages}</p>
            </div>
            <div className="pageNav">
                <NextPage pageNum={props.pageNum} numPages={props.numPages} nextPage={props.nextPage} myIndex={props.myIndex}/>
            </div>
        </div>
    )
}

export default PageNav;