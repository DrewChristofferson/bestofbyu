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
    const match = useRouteMatch("/schools/:sid/:did")
    let professors = props.professors[0]
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
        if (props.detail && props.professors[1] >= 1){
            return(
                <div>
                    <PageNav pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex} nextPage={props.nextPage} numPages={numPages} />
                </div>
            )   
        } 
        else if (!props.detail && props.professors[1] >= 0){
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
        else if (!props.detail && props.professors[1] === 0){
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

    let getFooter = () => {
        if (!props.detail){
            return(
                    <TableFooter numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
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
