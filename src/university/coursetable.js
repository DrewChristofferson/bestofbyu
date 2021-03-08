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

    let getHeader = () => {
        if (props.courses[1] >= 0){
            return(
                <div className="pageNavigation">
                    <div className="tableHeaderChildMed">
                        <CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue}/>
                    </div>
                    <div className="tableHeaderChildBig">
                        <SearchBar handleChangeSearch={props.handleChangeSearch} />
                    </div>
                    <div className="tableHeaderChildMed">
                        <PageNav pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex} nextPage={props.nextPage} numPages={numPages} />
                    </div>
                </div>
            )
        } 
        else if (props.courses[1] === 0){
            return(
                <div>
                    <CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue}/>
                    <SearchBar handleChangeSearch={props.handleChangeSearch} />  
                </div>
                        

            )
        } else {
            return null;
        }
        
        
    }



    return(
        <div>
            {getHeader()}
            <Table courses={courses} createRating={props.createRating} getRatings={props.getRatings}/>
            <TableFooter numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
        </div>   
    )
}


export default CourseTable;