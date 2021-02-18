import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { listDepartments } from './graphql/queries';
import { ratingsByUserAndContent } from './graphql/queries';
import { Switch, Route, useRouteMatch, useHistory, Link } from 'react-router-dom'
import CreateModal from './createmodal'
import ProfessorTable from './professortable'
import CourseTable from './coursetable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateProfessor as updateProfessorMutation } from './graphql/mutations';
import { updateCourse as updateCourseMutation } from './graphql/mutations';
import { createRating as createRatingMutation } from './graphql/mutations';
import { updateRating as updateRatingMutation } from './graphql/mutations';
import { deleteRating as deleteRatingMutation } from './graphql/mutations';
import { Auth } from 'aws-amplify';




function SchoolTables(props) {
    //------------Constants-------------------//
            //----State Contants----//

    const [categoryValue, setCategoryValue] = useState('professors');

    const [searchFilter, setSearchFilter] = useState('');
    const [userid, setUserid] = useState(null);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageNum, setPageNum] = useState(1);

    const CLASS_VOTE_UP = "tableSelectedUp";
    const CLASS_VOTE_DOWN = "tableSelectedDown";
    const CLASS_NO_VOTE = "tableNotSelected";
    const URL_PARAM_ALL = "all";
    const URL_PARAM_COURSES = "courses";
    const URL_PARAM_PROFESSORS = "professors";
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    const CATEGORIES = [
        { name: 'Professors', value: 'professors' },
        { name: 'Courses', value: 'courses' }
      ];
    
    //---------------Private Variables---------//
    let history = useHistory();
    let match = useRouteMatch("/schools/:sid/:did");
    let cat = useRouteMatch("/schools/:sid/:did/:cat");

    //------------Private Methods--------------//
    let getCourses;
    let getProfessors;
    let getTitle;
    let handleChangeToggle;
    let handleChangeSearch;


    //----------------Hooks---------------------//
    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then (user => {
            setUserid(user.username);
            console.log(props)
            props.getRatings(user.username);
        }).catch(err => console.log(err));
    }, []);


    useEffect(() => {
        
        handleChangeToggle(cat.params.cat);
    }, []);


    //-----------------------Methods---------------------//










    getCourses =  () => {
        let courses = [];
        console.log("this is the sid********************", (match.params.sid === "ge"))
        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get all courses 
            console.log("-----------------------all-------------------------------")
            for (let i = 0; i < props.departments.length; i++) {
                for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                    for(let k = 0; k < props.userRatings.length; k ++){
                        if (props.userRatings[k].contentID === props.departments[i].courses.items[j].id){
                            props.departments[i].courses.items[j].userRating = props.userRatings[k].ratingType;
                        }   
                    }
                    if(props.departments[i].courses.items[j].name.includes(searchFilter)){
                        courses.push(props.departments[i].courses.items[j]);
                    } 
                }
            }
        } else if(match.params.sid === "ge" && match.params.did === URL_PARAM_ALL){ //get courses from the department in the url
            console.log("--------------------ge-----------------")
            for (let i = 0; i < props.departments.length; i++) {
                for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                    console.log("*****************************", props.departments[i].courses.items[j].isGeneral)
                    if (props.departments[i].courses.items[j].isGeneral === true){
                        console.log()
                        for(let k = 0; k < props.userRatings.length; k ++){
                            if (props.userRatings[k].contentID === props.departments[i].courses.items[j].id){
                                props.departments[i].courses.items[j].userRating = props.userRatings[k].ratingType;
                            }   
                        }
                        if(props.departments[i].courses.items[j].name.includes(searchFilter)){
                            courses.push(props.departments[i].courses.items[j]);
                        } 
                    }  
                }
                
            }
        } else if(match.params.sid === "ge" && match.params.did !== URL_PARAM_ALL){ //get courses from the department in the url
            console.log("--------------------ge req-----------------")
            for (let i = 0; i < props.departments.length; i++) {
                for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                    if (props.departments[i].courses.items[j].isGeneral === true && props.departments[i].courses.items[j].generalReqID === match.params.did){
                        for(let k = 0; k < props.userRatings.length; k ++){
                            if (props.userRatings[k].contentID === props.departments[i].courses.items[j].id){
                                props.departments[i].courses.items[j].userRating = props.userRatings[k].ratingType;
                            }   
                        }
                        if(props.departments[i].courses.items[j].name.includes(searchFilter)){
                            courses.push(props.departments[i].courses.items[j]);
                        } 
                    }  
                }
                
            }
        } else if(match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get courses from the department in the url
            console.log("--------------------custom-----------------")
            for (let i = 0; i < props.departments.length; i++) {
                if(props.departments[i].school.id === match.params.sid) {
                    for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                        for(let k = 0; k < props.userRatings.length; k ++){
                            if (props.userRatings[k].contentID === props.departments[i].courses.items[j].id){
                                props.departments[i].courses.items[j].userRating = props.userRatings[k].ratingType;
                            }   
                        }
                        if(props.departments[i].courses.items[j].name.includes(searchFilter)){
                            courses.push(props.departments[i].courses.items[j]);
                        } 
                    }
                }
            }
        }  else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){ //get courses from the department in the url
            console.log("--------------------both custom-----------------")
            for (let i = 0; i < props.departments.length; i++) {
                if(props.departments[i].id === match.params.did) {
                    for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                        for(let k = 0; k < props.userRatings.length; k ++){
                            if (props.userRatings[k].contentID === props.departments[i].courses.items[j].id){
                                props.departments[i].courses.items[j].userRating = props.userRatings[k].ratingType;
                            }   
                        }
                        if(props.departments[i].courses.items[j].name.includes(searchFilter)){
                            courses.push(props.departments[i].courses.items[j]);
                        } 
                    }
                }
            }
        } else {
            console.log("--------------------default-----------------")
            return;
        }
        return(courses)
    }
 
    getProfessors =  () => {
        let professors = []
        let filteredProfessors = [];
        let paginatedProfessors = [];
        let endingIndex;

        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            for (let i = 0; i < props.departments.length; i++) {
                for(let j = 0; j < props.departments[i].professors.items.length; j ++){
                    // for(let k = 0; k < props.userRatings.length; k ++){
                    //     if (props.userRatings[k].contentID === props.departments[i].professors.items[j].id){
                    //         props.departments[i].professors.items[j].userRating = props.userRatings[k].ratingType;
                    //     }   
                    // }
                    console.log("hello", props.departments[i].professors.items[j].name.includes(searchFilter))
                    // if(props.departments[i].professors.items[j].name.includes(searchFilter)){
                    //     professors.push(props.departments[i].professors.items[j]);
                    // } 
                    professors.push(props.departments[i].professors.items[j]);
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < props.departments.length; i++) {
                if(props.departments[i].school.id === match.params.sid) {
                    for(let j = 0; j < props.departments[i].professors.items.length; j ++){
                            professors.push(props.departments[i].professors.items[j]);
                    }
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL) {
            for (let i = 0; i < props.departments.length; i++) {
                if(props.departments[i].id === match.params.did) {
                    for(let j = 0; j < props.departments[i].professors.items.length; j ++){
                            professors.push(props.departments[i].professors.items[j]);
                    }
                }
            }
        } else {
            return;
        }
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        professors.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
        
        for (let i = 0; i < professors.length; i++){
            professors[i].ranking = i + 1;
            if(professors[i].name.toLowerCase().includes(searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === professors[i].id){
                        professors[i].userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredProfessors.push(professors[i])
            }
            
        }
        
        for (let i = pageStartIndex; paginatedProfessors.length < 10; i++){
            
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        return [paginatedProfessors, filteredProfessors.length, endingIndex];
    }

    let nextPage = (index) => {
        setPageStartIndex(index);
        setPageNum(pageNum + 1);
    }

    let previousPage = (index) => {
        console.log("the index is", index)
        if(index > 20){
            setPageStartIndex(index - 20);
            setPageNum(pageNum - 1);
        } else if (index > 10 && index <= 20) {
            setPageStartIndex(0);
            setPageNum(pageNum - 1);
        }
    }

    getTitle = () => {

       let name;
       
        if(match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            return (
                <bs.Row style={{marginBottom: "3rem"}}>
                    <h1>All Colleges</h1>
                </bs.Row>
            ) 
        } else if (match.params.sid === "ge") {
                return(
                    <div style={{marginBottom: "3rem"}}>
                        <bs.Row>
                            <h1>General Education</h1>  
                        </bs.Row>   
                    </div>
                )
            // for (let i = 0; i < props.departments.length; i++){
            //     if(props.departments[i].school.id === match.params.sid){
            //         name = props.departments[i].school.name;
            //         break;
            //     }
            // }
            // if (name){
            //     return(
            //         <div style={{marginBottom: "3rem"}}>
            //             <bs.Row>
            //                 <h1>{name}</h1>  
            //             </bs.Row>   
            //         </div>
            //     )
            // } else {
            //     return (
            //         <bs.Row style={{marginBottom: "3rem"}}>
            //             <h3>No Data for this Department</h3>
            //         </bs.Row>
            //     )
            // }

        }else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < props.departments.length; i++){
                if(props.departments[i].school.id === match.params.sid){
                    name = props.departments[i].school.name;
                    break;
                }
            }
            if (name){
                return(
                    <div style={{marginBottom: "3rem"}}>
                        <bs.Row>
                            <h1>{name}</h1>  
                        </bs.Row>   
                    </div>
                )
            } else {
                return (
                    <bs.Row style={{marginBottom: "3rem"}}>
                        <h3>No Data for this Department</h3>
                    </bs.Row>
                )
            }

        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){
            for (let i = 0; i < props.departments.length; i++){
                if(props.departments[i].id === match.params.did){
                    name = props.departments[i].professors.items;
                }
            }
            if (name[0]){
                return (  
                    <div style={{marginBottom: "3rem"}}>
                        <bs.Row>
                        <h1>{name[0].department.name}</h1>  
                        </bs.Row>  
                        <bs.Row >
                            <h3>{name[0].department.school.name}</h3>
                        </bs.Row>     
                    </div>
    
                )
            } else {
                return (
                    <bs.Row style={{marginBottom: "3rem"}}>
                        <h3>No Data for this Department</h3>
                    </bs.Row>
                )
            }

        }
        else {
            return (
                <bs.Row style={{marginBottom: "3rem"}}>
                    <h3>No Data for this Department</h3>
                </bs.Row>
            )
        } 
    }



    handleChangeToggle = (val) => {
        setCategoryValue(val);
        history.push(`${match.url}/${val}`);
    }

    handleChangeSearch = (val) => {
        // console.log(val);
        setSearchFilter(val);
        setPageNum(1);
        setPageStartIndex(0);
    }

    //-------------------Public Rendering-------------------//

    if (props.isLoading){
        return(
            <bs.Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </bs.Spinner>
        )
    }
    else {
        return(
            <>
                <bs.Container fluid >
                    {getTitle()} 

                    <bs.Row >
                        <bs.Col md="6" >
                            <bs.ButtonGroup toggle>
                                {CATEGORIES.map((category, index) => (
                                <bs.ToggleButton
                                    key={index}
                                    type="radio"
                                    variant="secondary"
                                    name="category"
                                    value={category.value}
                                    checked={categoryValue === category.value}
                                    onChange={(e) => handleChangeToggle(e.currentTarget.value)}
                                >
                                    {category.name}
                                </bs.ToggleButton>
                                ))}
                            </bs.ButtonGroup>
                        </bs.Col>
    
                        <bs.Col md="5" style={{paddingTop: ".3rem"}}>
                            <bs.Form style={{paddingLeft: "1rem"}}>
                                <bs.Form.Group controlId="exampleForm.ControlInput1" >
                            
                                    <bs.Form.Control type="text" placeholder="Search for a Professor" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                                </bs.Form.Group>
                            </bs.Form>
                        </bs.Col>
                        {/* <bs.Col md="1">
                            <CreateModal />
                        </bs.Col> */}
                    </bs.Row>
    
                </bs.Container>
    
                <Switch>
                    <Route path={`${match.path}/${URL_PARAM_PROFESSORS}`}>
                        <ProfessorTable  userid={userid} professors={getProfessors()} updateScore={props.updateScore} getRatings={props.getRatings}  createRating={props.createRating} nextPage={nextPage} previousPage={previousPage} pageNum={pageNum}/>
                    </Route>
                    <Route path={`${match.path}/${URL_PARAM_COURSES}`}>
                        <CourseTable  userid={userid} courses={getCourses()} updateScore={props.updateScore} getRatings={props.getRatings}  createRating={props.createRating}/>

                    </Route>
                </Switch>
    
            </>
        )
    }


}

export default SchoolTables;