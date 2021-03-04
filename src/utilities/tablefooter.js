import React from 'react'
import * as bs from 'react-bootstrap'
import CreateModal from './createprofmodal'
import PreviousPage from './previousPage'
import NextPage from './nextPage'
import { useRouteMatch } from 'react-router-dom'
import CreateProfModal from './createprofmodal'
import CreateCourseModal from './createcoursemodal'

function TableFooter (props) {
    console.log("building the footer")

    let match = useRouteMatch("/schools/:sid/:did/:type");

    let returnButton = () => {
        console.log(match.params.type)
        if(match.params.type === "professors"){
            return(
                <CreateProfModal />
            )
        } else {
            return(
                <CreateCourseModal />
            )
        }
    }
    
    let returnCreateButton = () => {
        console.log(props.numPages)
        console.log(props.pageNum)
        if (props.numPages === 1 || props.numPages === 0 || props.pageNum === props.numPages){
            return(
                <>
                    <bs.Col md="3"></bs.Col>
                        <bs.Col style={{fontSize: "2rem"}} md="7">
                            <bs.Row>
                                <h3>Don't see what you're looking for?</h3>
                            </bs.Row>
                            <bs.Row style={{paddingLeft: "8rem"}}>
                                {returnButton()}
                            </bs.Row>
                        </bs.Col>
                    <bs.Col md="2"></bs.Col>
                </>
            )
        } else {
            return null;
        }
    }
    
    return(
        <bs.Container>
            <bs.Row style={{paddingBottom: "3em"}}>
                {returnCreateButton()}
            </bs.Row>
            <bs.Row>
                <bs.Col md="4"></bs.Col>
                <bs.Col style={{fontSize: "1.2rem"}} md="5">
                    <bs.Row>
                        <bs.Col md="2">
                            <PreviousPage pageNum={props.pageNum} previousPage={props.previousPage} myIndex={props.myIndex}/>
                        </bs.Col>
                        <bs.Col md="5" >
                            <h5>Page {props.pageNum} of {props.numPages}</h5>
                        </bs.Col>
                        <bs.Col md="2">
                            <NextPage pageNum={props.pageNum} numPages={props.numPages} nextPage={props.nextPage} myIndex={props.myIndex}/>
                        </bs.Col>
                        
                    </bs.Row>
                </bs.Col>
                <bs.Col md="2"></bs.Col>
            </bs.Row>
        
        </bs.Container>     
    )
    
}

export default TableFooter;