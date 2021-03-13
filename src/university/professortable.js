import React, {useEffect} from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import TableFooter from '../utilities/tablefooter'
import PreviousPage from '../utilities/previousPage'
import NextPage from '../utilities/nextPage'
import BooksImg from '../images/books.jpg'
import SearchBar from '../utilities/searchbar'
import CategoryToggle from '../utilities/categorytoggle'
import PageNav from '../utilities/pageNav'
import Table from './table'
import NewSideBarDesktop from'../main/newsidebardesktop'





function ProfessorTable(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type")
    let professors = props.professors[0]
    let totalItemsCount = props.professors[1];
    //if there are no professors, default the number of pages to 1
    let numPages = Math.ceil(props.professors[1] / 10);
    let myIndex = props.professors[2];

    const CLASS_VOTE_UP = "tableSelectedUp";
    const CLASS_VOTE_DOWN = "tableSelectedDown";
    const CLASS_NO_VOTE = "tableNotSelected";
    const URL_PARAM_PROFESSORS = "professors"
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";


    let getImg = (professor) => {
        if (professor.imgsrc){
            return(
                <img className="profile" alt={professor.name} style={{height:"160px", width: "140px"}} src={professor.imgsrc} />

            )
        } else {
            return(
                <img className="profile" alt={professor.name} style={{height:"160px", width: "140px"}} src={BooksImg} />
            )

        }
    }

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

    let getFooter = () => {
        if (!props.detail){
            return(
                    <TableFooter numPages={numPages} totalItemsCount={totalItemsCount} getDepartments={props.getDepartments} departments={props.departments} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
            )
        } else {
            return null;
        }
    }


    return(
        <div>
            {getHeader()}
            
            <NewSideBarDesktop colleges={props.colleges} initPageNum={props.initPageNum}/>
                    
            <Table professors={professors} getImg={getImg} createRating={props.createRating} getRatings={props.getRatings}/>
            {getFooter()}
        </div>   
    )
}

export default ProfessorTable;
