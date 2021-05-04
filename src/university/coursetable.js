import React from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import TableFooter from '../components/tablefooter'
import SearchBar from '../components/searchbar'
import CategoryToggle from '../components/categorytoggle'
import Table from './table'
import NewSideBarDesktop from'../main/newsidebardesktop'

function CourseTable(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type")
    let courses = props.courses[0]
    let totalItemsCount = props.courses[1];
    let numPages = Math.ceil(props.courses[1] / 10) ;
    let myIndex = props.courses[2];

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
            
            <NewSideBarDesktop colleges={props.colleges} initPageNum={props.initPageNum}/>
            {getHeader()}
            <Table courses={courses} totalItemsCount={totalItemsCount} departments={props.departments} createRating={props.createRating} getRatings={props.getRatings} userRatings={props.userRatings}/>
            <TableFooter getDepartments={props.getDepartments} totalItemsCount={totalItemsCount} numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
        </div>   
    )
}


export default CourseTable;