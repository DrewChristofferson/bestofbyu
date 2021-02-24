import React from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateCourse as updateCourseMutation } from './graphql/mutations';
import PreviousPage from './previousPage'
import NextPage from './nextPage'
import TableFooter from './tablefooter'



function CourseTable(props) {
    const match = useRouteMatch("/schools/:sid/:did")
    let courses = props.courses[0]
    let numPages = Math.ceil(props.courses[1] / 10) ;
    let myIndex = props.courses[2];

    const CLASS_VOTE_UP = "tableSelectedUp";
    const CLASS_VOTE_DOWN = "tableSelectedDown";
    const CLASS_NO_VOTE = "tableNotSelected";
    const URL_PARAM_COURSES = "courses";
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";


    return(
        <bs.Container style={{paddingTop: "2rem", marginLeft: "0.5rem", marginRight: "0.5rem"}} fluid>
            <bs.Row style={{fontSize: "2rem", paddingBottom: "2rem"}} >
                <bs.Col md="9"></bs.Col>
                <bs.Col md="1">
                    <PreviousPage pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex}/>
                </bs.Col>
                <bs.Col md="1">
                    <h3>{props.pageNum} of {numPages}</h3>
                </bs.Col>
                <bs.Col md="1">
                    <NextPage pageNum={props.pageNum} numPages={numPages} nextPage={props.nextPage} myIndex={myIndex}/>
                </bs.Col>
            </bs.Row>
            {
                
                courses.map((course, index) => (
                    <bs.Row style={{paddingTop: "1.5rem", paddingBottom: "1.5rem", borderTop: "2px solid black"}} key={index}>
                        <bs.Col style={{fontSize: "2rem", textAlign: "center", paddingTop: ".8rem"}} md="1">
                            {course.ranking === 1 ? 
                                <img  alt={course.name} style={{height:"40px", width: "50px"}} src="data:image/png;base64,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" /> 
                                : course.ranking}
                        </bs.Col>
                        <bs.Col style={{fontSize: "2.5rem", paddingTop: ".8rem"}} md="1">
                            <bs.Row className={course.userRating === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE } style={{ cursor: "pointer", paddingLeft: "3rem"}} onClick={() => props.createRating(course.id, VOTE_UP, updateCourseMutation, course.score)}>
                                <FontAwesomeIcon icon={faSortUp}/>
                            </bs.Row>
                            <bs.Row className={course.userRating === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE } style={{ cursor: "pointer", paddingLeft: "3rem"}} onClick={() => props.createRating(course.id, VOTE_DOWN, updateCourseMutation, course.score)}>
                                <FontAwesomeIcon icon={faSortDown}/>                                                
                            </bs.Row>
                        </bs.Col>
                        <bs.Col style={{}} md="2">
                            <img className="profile" alt={course.name} style={{height:"100px", width: "100px"}} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
                        </bs.Col>
                        <bs.Col md="3">
                            <bs.Row style={{fontSize: "1.5rem"}}>
                                <strong><Link to={`${match.url}/${URL_PARAM_COURSES}/${course.id}`}>{course.name}</Link></strong>
                            </bs.Row>
                            <bs.Row style={{fontSize: "1.5rem"}} >
                                {course.score} Points
                            </bs.Row>
                        </bs.Col>
                        <bs.Col style={{fontSize: "1.2rem"}} md="4">
                            <bs.Row>
                                <strong>Credits</strong> {": "  + course.numCredits}
                            </bs.Row>
                            <bs.Row>
                                <strong>Department</strong> {": " + course.department.name}
                            </bs.Row>
                            <bs.Row>
                                <strong>College</strong> {": " + course.department.school.name}
                            </bs.Row>
                        </bs.Col>
                        <bs.Col style={{fontSize: "1.8rem", paddingTop: "2rem", cursor: "pointer"}} md="1">
                            <bs.Dropdown>
                                <bs.Dropdown.Toggle variant="info" id="dropdown-basic">
                                    {/* <FontAwesomeIcon icon={faEllipsisV}/> */}
                                </bs.Dropdown.Toggle>

                                <bs.Dropdown.Menu>
                                    <bs.Dropdown.Item href={`${match.url}/${URL_PARAM_COURSES}/${course.id}`}>View Details</bs.Dropdown.Item>
                                    <bs.Dropdown.Item href="">Save {course.name}</bs.Dropdown.Item>
                                    <bs.Dropdown.Item onClick={() => alert("Thank you for marking " + course.name + " as a duplicate.")}>Mark Duplicate</bs.Dropdown.Item>
                                    <bs.Dropdown.Item onClick={() => alert("Thank you for reporting this. Our moderators will review " + course.name + ".")}>Report</bs.Dropdown.Item> 
                                </bs.Dropdown.Menu>
                            </bs.Dropdown>
                            
                        </bs.Col>
                    </bs.Row>
                    
                ))
            }
            <bs.Row >
                <TableFooter numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
            </bs.Row>
        </bs.Container>
    )
    }

export default CourseTable;