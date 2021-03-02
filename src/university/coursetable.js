import React from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateCourse as updateCourseMutation } from '../graphql/mutations';
import PreviousPage from '../utilities/previousPage'
import NextPage from '../utilities/nextPage'
import TableFooter from '../utilities/tablefooter'
import SearchBar from '../utilities/searchbar'
import CategoryToggle from '../utilities/categorytoggle'
import PageNav from '../utilities/pageNav'
import Table from './table'




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
                <bs.Col md="4"><CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue} initPageNum={props.initPageNum} /></bs.Col>
                <bs.Col md="2"></bs.Col>
                <bs.Col md="4" className="py-2"><SearchBar handleChangeSearch={props.handleChangeSearch} /></bs.Col>
                <bs.Col md="2" className="py-3"><PageNav pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex} nextPage={props.nextPage} numPages={numPages} /></bs.Col>
            </bs.Row>
                <Table courses={courses} createRating={props.createRating} getRatings={props.getRatings}/>
            <bs.Row >
                <TableFooter numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
            </bs.Row>
        </bs.Container>
    )
    }

export default CourseTable;