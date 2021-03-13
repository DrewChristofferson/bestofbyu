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
import NewSideBarDesktop from'../main/newsidebardesktop'





function CourseTable(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type")
    let courses = props.courses[0]
    
    let totalItemsCount = props.courses[1];
    let numPages = Math.ceil(props.courses[1] / 10) ;
    let myIndex = props.courses[2];

    const CLASS_VOTE_UP = "tableSelectedUp";
    const CLASS_VOTE_DOWN = "tableSelectedDown";
    const CLASS_NO_VOTE = "tableNotSelected";
    const URL_PARAM_COURSES = "courses";
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";

    let getHeader = () => {
        if (!props.detail){
            return(
                <div className="tableHeader">
                    <div className="tableHeaderToggle">
                        <CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue}/>
                    </div>
                    <div className="tableHeaderSearch">
                        <SearchBar handleChangeSearch={props.handleChangeSearch} />
                    </div>
                    <div className="tableHeaderResults">
                        Found {totalItemsCount} {match.params.type}
                    </div>
                </div>
            )
        } else {
            return null;
        }
        
        
    }



    return(
        <div>
            {getHeader()}
            <NewSideBarDesktop colleges={props.colleges} initPageNum={props.initPageNum}/>
            <Table courses={courses} totalItemsCount={totalItemsCount} departments={props.departments} createRating={props.createRating} getRatings={props.getRatings} userRatings={props.userRatings}/>
            <TableFooter getDepartments={props.getDepartments} totalItemsCount={totalItemsCount} numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
        </div>   
    )
}


export default CourseTable;