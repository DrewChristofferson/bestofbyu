import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { listDepartments } from './graphql/queries';
import { ratingsByUserAndContent } from './graphql/queries';
import { Switch, Route, useRouteMatch, useHistory, Link } from 'react-router-dom'
import CreateModal from './createmodal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateProfessor as updateProfessorMutation } from './graphql/mutations';
import { createRating as createRatingMutation } from './graphql/mutations';
import { updateRating as updateRatingMutation } from './graphql/mutations';
import { deleteRating as deleteRatingMutation } from './graphql/mutations';
import { Auth } from 'aws-amplify';




function SchoolTables(props) {
    //------------Constants-------------------//
            //----State Contants----//
    const [departments, setDepartments] = useState({});
    const [categoryValue, setCategoryValue] = useState('professors');
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState('');
    const [userid, setUserid] = useState(null);
    const [userRatings, setUserRatings] = useState({});

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
            getRatings(user.username);
        }).catch(err => console.log(err));
    }, []);


    useEffect(() => {
        getData();
    }, []);


    //-----------------------Methods---------------------//


    async function getData() {
        const apiData = await API.graphql({ query: listDepartments });
        const departmentsFromAPI = apiData.data.listDepartments.items;

        await Promise.all(departmentsFromAPI.map(async department => {
          return department;
        }))

        setDepartments(apiData.data.listDepartments.items);
        setIsLoading(false);
    }

    //onload getRatings gets passed the username from UseState on line 41. TODO: figure out how to get the userstate right away
    async function getRatings(user) {
        const userRatingsData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": user }});
        const userRatingsFromAPI = userRatingsData.data.ratingsByUserAndContent.items;

        await Promise.all(userRatingsFromAPI.map(async rating => {
          return rating;
        }))

        setUserRatings(userRatingsData.data.ratingsByUserAndContent.items);
    }

    async function createRating(contentID, type, mutationName, score) {
        let ratingIdFromAPI;
        if (!userid) return;
        try {
            const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": userid, "contentID": {eq: contentID } }});
            ratingIdFromAPI = ratingData.data.ratingsByUserAndContent.items;
        } catch (e) {
            return e;
        }
        if(ratingIdFromAPI[0] === undefined){
            try {
                await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": contentID, "userID": userid, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }
        } else if (ratingIdFromAPI[0].ratingType === type){
            type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
            try {
                await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }
        } else {
            type === VOTE_UP ? score += 1 : score -= 1;
            try {
                await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }
        }
      }

      async function updateScore(id, score, increment, mutationName) {
        try{
            if (increment === VOTE_UP) {
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score + 1} } });
            }    
            else if (increment === VOTE_DOWN){
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score - 1} } });
            }
        }
        catch (e) {
            return e;
        }
        finally{
            getData();
        }
    }

    getCourses =  () => {
        let courses = [];
        console.log(departments)
        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get all courses 
            for (let i = 0; i < departments.length; i++) {
                for(let j = 0; j < departments[i].courses.items.length; j ++){
                    for(let k = 0; k < userRatings.length; k ++){
                        if (userRatings[k].contentID === departments[i].courses.items[j].id){
                            departments[i].courses.items[j].userRating = userRatings[k].ratingType;
                        }   
                    }
                    courses.push(departments[i].courses.items[j]);
                }
            }
        } else if(match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < departments.length; i++) {
                if(departments[i].school.id === match.params.sid) {
                    for(let j = 0; j < departments[i].courses.items.length; j ++){
                        for(let k = 0; k < userRatings.length; k ++){
                            if (userRatings[k].contentID === departments[i].courses.items[j].id){
                                departments[i].courses.items[j].userRating = userRatings[k].ratingType;
                            }   
                        }
                        courses.push(departments[i].courses.items[j]);
                    }
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < departments.length; i++) {
                if(departments[i].id === match.params.did) {
                    for(let j = 0; j < departments[i].courses.items.length; j ++){
                        for(let k = 0; k < userRatings.length; k ++){
                            if (userRatings[k].contentID === departments[i].courses.items[j].id){
                                departments[i].courses.items[j].userRating = userRatings[k].ratingType;
                            }   
                        }
                        courses.push(departments[i].courses.items[j]);
                    }
                }
            }
        } else {
            return;
        }
        return(courses)
    }
 
    getProfessors =  () => {
        let professors = []

        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            for (let i = 0; i < departments.length; i++) {
                for(let j = 0; j < departments[i].professors.items.length; j ++){
                    for(let k = 0; k < userRatings.length; k ++){
                        if (userRatings[k].contentID === departments[i].professors.items[j].id){
                            departments[i].professors.items[j].userRating = userRatings[k].ratingType;
                        }   
                    }
                    console.log("hello", departments[i].professors.items[j].name.includes(searchFilter))
                    if(departments[i].professors.items[j].name.includes(searchFilter)){
                        professors.push(departments[i].professors.items[j]);
                    } 
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < departments.length; i++) {
                if(departments[i].school.id === match.params.sid) {
                    for(let j = 0; j < departments[i].professors.items.length; j ++){
                        for(let k = 0; k < userRatings.length; k ++){
                            if (userRatings[k].contentID === departments[i].professors.items[j].id){
                                departments[i].professors.items[j].userRating = userRatings[k].ratingType;
                            }   
                        }
                        if(departments[i].professors.items[j].name.includes(searchFilter)){
                            professors.push(departments[i].professors.items[j]);
                        } 
                    }
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL) {
            for (let i = 0; i < departments.length; i++) {
                if(departments[i].id === match.params.did) {
                    for(let j = 0; j < departments[i].professors.items.length; j ++){
                        for(let k = 0; k < userRatings.length; k ++){
                            if (userRatings[k].contentID === departments[i].professors.items[j].id){
                                departments[i].professors.items[j].userRating = userRatings[k].ratingType;
                            }   
                        }
                        if(departments[i].professors.items[j].name.includes(searchFilter)){
                            professors.push(departments[i].professors.items[j]);
                        } 
                    }
                }
            }
        } else {
            return;
        }
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        professors.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
        return(professors);
    }

    getTitle = () => {

       let data;
       
        if(match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            return (
                <bs.Row>
                    <h1>All Colleges</h1>
                </bs.Row>
            ) 
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < departments.length; i++){
                if(departments[i].school.id === match.params.sid){
                    data = departments[i].professors.items;
                }
            }
            if (data){
                return(
                    <div style={{marginBottom: "3rem"}}>
                        <bs.Row>
                            <h1>{data[0].department.school.name}</h1>  
                        </bs.Row>   
                    </div>
                )
            } else {
                return (
                    <bs.Row>
                        <h3>No Data for this Department</h3>
                    </bs.Row>
                )
            }

        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){
            for (let i = 0; i < departments.length; i++){
                if(departments[i].id === match.params.did){
                    data = departments[i].professors.items;
                }
            }
            if (data){
                return (  
                    <div style={{marginBottom: "3rem"}}>
                        <bs.Row>
                        <h1>{data[0].department.name}</h1>  
                        </bs.Row>  
                        <bs.Row >
                            <h3>{data[0].department.school.name}</h3>
                        </bs.Row>     
                    </div>
    
                )
            } else {
                return (
                    <bs.Row>
                        <h3>No Data for this Department</h3>
                    </bs.Row>
                )
            }

        }
        else {
            return (
                <bs.Row>
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
    }

    //-------------------Public Rendering-------------------//

    if (isLoading){
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
                        <bs.Col md="1">
                            <CreateModal />
                        </bs.Col>
                    </bs.Row>
    
                </bs.Container>
    
                <Switch>
                    <Route path={`${match.path}/${URL_PARAM_PROFESSORS}`}>
                        <bs.Table striped bordered hover>
                            <thead>
                                <tr>
                                <th></th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Department</th>
                                <th>School</th>
                                <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                
                                getProfessors().map((professor, index) => (
                                    <tr key={professor.id} height="60px" style={{ fontSize: "20px" }}>
                                    <td style={{ padding: "10px", textAlign: "center", fontSize: "40px"}}>
                                        <tr >
                                            <div key={index+"a"} className={professor.userRating === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE } style={{ cursor: "pointer"}} onClick={() => createRating(professor.id, VOTE_UP, updateProfessorMutation, professor.score)}><FontAwesomeIcon icon={faSortUp}/></div>
                                        </tr>
                                        <tr>
                                            <div key={index+"b"} className={professor.userRating === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE } style={{ cursor: "pointer"}} onClick={() => createRating(professor.id, VOTE_DOWN, updateProfessorMutation, professor.score)}><FontAwesomeIcon icon={faSortDown}/></div>
                                        </tr>
                                    </td>
                                    <td>{index + 1}</td>
                                    <td><Link to={`${match.url}/${URL_PARAM_PROFESSORS}/${professor.id}`}>{professor.name}</Link></td>
                                    <td>{professor.title}</td>
                                    <td>{professor.department.name}</td>
                                    <td>{professor.department.school.name}</td>
                                    <td>{professor.score}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </bs.Table>
                    </Route>
                    <Route path={`${match.path}/${URL_PARAM_COURSES}`}>
                        <bs.Table striped bordered hover>
                            <thead>
                                <tr>
                                <th></th>
                                <th>#</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Number of Credits</th>
                                <th>School</th>
                                <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                
                                getCourses().map((course, index) => (
                                    <tr key={course.id}>
                                    <td style={{ padding: "0", textAlign: "center", fontSize: "25px"}}>
                                        <div key={index+"a"} className={course.userRating === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE } style={{ cursor: "pointer", top: "0", height: "10px"}} onClick={() => createRating(course.id, VOTE_UP)}><FontAwesomeIcon icon={faSortUp}/></div>
                                        <div key={index+"b"} className={course.userRating === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE } style={{ cursor: "pointer", height: "10px"}} onClick={() => createRating(course.id, VOTE_DOWN)}><FontAwesomeIcon icon={faSortDown}/></div>
                                    </td>
                                    <td>{index + 1}</td>
                                    <td><Link to={`${match.url}/${URL_PARAM_COURSES}/${course.id}`}>{course.name}</Link></td>
                                    <td>{course.code}</td>
                                    <td>{course.numCredits}</td>
                                    <td></td>
                                    <td></td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </bs.Table>
                    </Route>
                </Switch>
    
    
    
            </>
        )
    }


}

export default SchoolTables;