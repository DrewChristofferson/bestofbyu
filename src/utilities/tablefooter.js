import React from 'react'
import * as bs from 'react-bootstrap'
import CreateModal from './createprofmodal'
import PreviousPage from './previousPage'
import NextPage from './nextPage'
import { useRouteMatch } from 'react-router-dom'
import CreateProfModal from './createprofmodal'
import CreateCourseModal from './createcoursemodal'

function TableFooter (props) {
    let match = useRouteMatch("/schools/:sid/:did/:type");

    let returnButton = () => {
        if(match.params.type === "professors"){
            return(
                <CreateProfModal getDepartments={props.getDepartments}/>
            )
        } else {
            return(
                <CreateCourseModal getDepartments={props.getDepartments}/>
            )
        }
    }
    
    let returnCreateButton = () => {
        if (props.numPages === 1 || props.numPages === 0 || props.pageNum === props.numPages){
            return(
                    <div>
                        <h5>Don't see what you're looking for?</h5>
                        {returnButton()}
                    </div>
            )
        } else {
            return (
                <bs.Button onClick={() => props.nextPage(props.myIndex)}>See More</bs.Button>
            )
        }
    }
    
    return(
        <div className="tableFooter">
            <div className="footerResults">
                <div className="footerDetail">
                    {props.totalItemsCount > 0 ?
                        `Showing Results 1 -  ${props.myIndex} of ${props.totalItemsCount}`
                        : null
                    }
                    
                </div>
                <div className="footerButton" onClick={() => window.scrollTo(0, 0)}>
                {props.totalItemsCount > 0 ?
                        "Back to Top"
                        : null
                    }
                </div>
            </div>
            <div className="footerExtra">
                {returnCreateButton()}
            </div>
            <div>

            </div>
        </div>   
    )
    
}

export default TableFooter;