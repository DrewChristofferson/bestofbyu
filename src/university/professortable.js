import React, {useEffect} from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import TableFooter from '../utilities/tablefooter'
import PreviousPage from '../utilities/previousPage'
import NextPage from '../utilities/nextPage'
import SearchBar from '../utilities/searchbar'
import CategoryToggle from '../utilities/categorytoggle'
import PageNav from '../utilities/pageNav'
import Table from './table'




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
                <img className="profile" alt={professor.name} style={{height:"100px", width: "90px"}} src={professor.imgsrc} />

            )
        } else {
            return(
                <img className="profile" alt={professor.name} style={{height:"100px", width: "100px"}} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
            )

        }
    }

    let getHeader = () => {
        if (props.detail && props.professors[1] >= 1){
            return(
                <bs.Row style={{fontSize: "2rem", paddingBottom: "2rem"}} >
                    <bs.Col md="10" ></bs.Col>
                    <bs.Col md="2" className="py-3"><PageNav pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex} nextPage={props.nextPage} numPages={numPages} /></bs.Col>
                </bs.Row>
            )   
        } 
        else if (!props.detail && props.professors[1] >= 1){
            return(
                <bs.Row style={{fontSize: "2rem", paddingBottom: "2rem"}} >
                    <bs.Col md="4"><CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue}/></bs.Col>
                    <bs.Col md="2"></bs.Col>
                    <bs.Col md="4" className="py-2"><SearchBar handleChangeSearch={props.handleChangeSearch} /></bs.Col>
                    <bs.Col md="2" className="py-3"><PageNav pageNum={props.pageNum} previousPage={props.previousPage} myIndex={myIndex} nextPage={props.nextPage} numPages={numPages} /></bs.Col>
                    
                </bs.Row>
            )
        } 
        else if (!props.detail && props.professors[1] === 0){
            return(
                <bs.Row style={{fontSize: "2rem", paddingBottom: "2rem"}} >
                    <bs.Col md="4"><CategoryToggle handleChangeToggle={props.handleChangeToggle} CATEGORIES={props.CATEGORIES} categoryValue={props.categoryValue}/></bs.Col>
                    <bs.Col md="2"></bs.Col>
                    <bs.Col md="4" className="py-2"><SearchBar handleChangeSearch={props.handleChangeSearch} /></bs.Col>                    
                </bs.Row>
            )
        } else {
            return null;
        }
        
        
    }

    let getFooter = () => {
        if (!props.detail){
            return(
                <bs.Row style={{paddingTop: "4rem"}}>
                    <TableFooter numPages={numPages} myIndex={myIndex} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum}/>
                </bs.Row>
            )
        } else {
            return null;
        }
    }


    return(
        <bs.Container style={{paddingTop: "2rem"}} fluid>
            {getHeader()}
            <Table professors={professors} getImg={getImg} createRating={props.createRating} getRatings={props.getRatings}/>
            {getFooter()}
        </bs.Container>
    )
}

export default ProfessorTable;
