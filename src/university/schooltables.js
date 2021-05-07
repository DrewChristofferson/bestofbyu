import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { Switch, Route, useRouteMatch, useHistory, Link } from 'react-router-dom'
import ProfessorTable from './professortable'
import CourseTable from './coursetable'
import { Auth } from 'aws-amplify';
import objGE from '../geobject';

function SchoolTables(props) {
    //------------Constants-------------------//
            //----State Contants----//

    const [categoryValue, setCategoryValue] = useState('professors');
    const [userid, setUserid] = useState(null);
    const [schoolName, setSchoolName] = useState('');
    const [deptName, setDeptName] = useState('');
    const URL_PARAM_ALL = "all";
    const URL_PARAM_COURSES = "courses";
    const URL_PARAM_PROFESSORS = "professors";
    const CATEGORIES = [
        { name: 'Courses', value: 'courses' },
        { name: 'Professors', value: 'professors' }
        
      ];
    
    //---------------Private Variables---------//
    let history = useHistory();
    let match = useRouteMatch("/schools/:sid/:did");
    let cat = useRouteMatch("/schools/:sid/:did/:cat");

    //------------Private Methods--------------//
    let getCourses;
    let getNewCourses;
    let getProfessors;
    let getTitle;
    let handleChangeToggle;


    //----------------Hooks---------------------//
    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then (user => {
            setUserid(user.username);
            props.getRatings(user.username);
        }).catch(err => console.log(err));
    }, []);


    useEffect(() => {
        // console.log(props.professors)
        
        handleChangeToggle(cat.params.cat);
    }, []);


    useEffect(() => {
        getTitle();

        // if(props.isFinishedLoadingCourses){
        //     let count = 0;
        //     for (const course of props.courses){
        //         if(!course.department?.name){
        //             count++;
        //             console.log("no dept", course);
        //         }  
        //     }
        //     console.log(count)
        // }
    });


    //-----------------------Methods---------------------//


    getNewCourses =  () => {
        let courses = [];
        let filteredCourses = [];
        let paginatedCourses = [];
        let endingIndex;

        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get all courses 
            for (let i = 0; i < props.courses.length; i++) {
                courses.push(props.courses[i]);
            }
        } else if(match.params.sid === "ge" && match.params.did === URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < props.courses.length; i++) {
                if (props.courses[i].isGeneral === true){
                    courses.push(props.courses[i]);
                }   
            }
        } else if(match.params.sid === "ge" && match.params.did !== URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < props.courses.length; i++) {
                if (props.courses[i].isGeneral === true && props.courses[i].generalReqID.includes(match.params.did)){
                        courses.push(props.courses[i]);
                    }                  
            }
        } else if(match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < props.courses.length; i++) {
                if(props.courses[i].department?.schoolID === match.params.sid) {
                    courses.push(props.courses[i]);
                }
            }
        }  else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){ //get courses from the department in the url
            for (let i = 0; i < props.courses.length; i++) {
                if(props.courses[i].department?.id === match.params.did) {
                    courses.push(props.courses[i]);
                }
            }
        } else {
            return null;
        }
        courses.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.code > b.code) ? 1 : -1) : -1 )

        for (let i = 0; i < courses.length; i++){
            courses[i].ranking = i + 1;
            if(courses[i].name.toLowerCase().includes(props.searchFilter.toLowerCase()) || courses[i].code.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === courses[i].id){
                        courses[i].userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredCourses.push(courses[i])
            }
        }
        for (let i = 0; i < props.pageStartIndex + 10; i++){
            if(filteredCourses[i]){
                paginatedCourses.push(filteredCourses[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        return [paginatedCourses, filteredCourses.length, endingIndex];
    }
 
    getProfessors =  () => {
        let professors = []
        let filteredProfessors = [];
        let paginatedProfessors = [];
        let endingIndex;

        if (match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            for (let i = 0; i < props.professors.length; i++) {
                professors.push(props.professors[i]);
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < props.professors.length; i++) {
                if(props.professors[i].department?.school?.id === match.params.sid) {
                    professors.push(props.professors[i]);
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL) {
            for (let i = 0; i < props.professors.length; i++) {
                if(props.professors[i].department?.id === match.params.did) {
                    professors.push(props.professors[i]);
                }
            }
        } else {
            return;
        }
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        professors.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
        
        for (let i = 0; i < professors.length; i++){
            professors[i].ranking = i + 1;
            if(professors[i].name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === professors[i].id){
                        professors[i].userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredProfessors.push(professors[i])
            }
            
        }
        
        for (let i = 0; i < props.pageStartIndex + 10; i++){
            
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        return [paginatedProfessors, filteredProfessors.length, endingIndex];
    }

    getTitle = () => {     
        if(match.params.sid === URL_PARAM_ALL && match.params.did === URL_PARAM_ALL){
            setSchoolName("All Colleges");
            setDeptName('');
        } else if (match.params.sid === "ge" && match.params.did === URL_PARAM_ALL) {
            setSchoolName("General Education");
            setDeptName('');
        } else if (match.params.sid === "ge") {
            setSchoolName("General Education");
            setDeptName(objGE[match.params.did]);
         

        }else if (match.params.sid !== URL_PARAM_ALL && match.params.did === URL_PARAM_ALL) {
            for (let i = 0; i < props.colleges.length; i++){
                if(props.colleges[i].id === match.params.sid){
                    setSchoolName(props.colleges[i].name);
                    setDeptName('');
                    break;
                }
            }
        } else if (match.params.sid !== URL_PARAM_ALL && match.params.did !== URL_PARAM_ALL){
            for (let i = 0; i < props.colleges.length; i++){
                if(props.colleges[i].id === match.params.sid){
                    setSchoolName(props.colleges[i].name);
                    for(let j = 0; j < props.colleges[i].departments.items.length; j++){
                        console.log(props.colleges[i].departments.items[j])
                        if(props.colleges[i].departments.items[j].id === match.params.did){
                            setDeptName(props.colleges[i].departments.items[j].name);
                            break;
                        }
                    }
                }
            }
        }
    }

    handleChangeToggle = (val) => {
        setCategoryValue(val);
        props.initPageNum();
        props.clearSearchFilter();
        history.push(`${match.url}/${val}`);
    }

    //-------------------Public Rendering-------------------//

    // if (props.isLoading){
    //     return(
    //         <bs.Spinner animation="border" role="status">
    //             <span className="sr-only">Loading...</span>
    //         </bs.Spinner>
    //     )
    // }
    // else {
        return(
            <>
                    <h1>{schoolName}</h1>
                    <h3>{deptName}</h3>
    
                <Switch>
                    <Route path={`${match.path}/${URL_PARAM_PROFESSORS}`}>
                        <ProfessorTable isFinishedLoading={props.isFinishedLoadingProfs} userid={userid} colleges={props.colleges} professors={getProfessors()} updateScore={props.updateScore} getRatings={props.getRatings}  createRating={props.createRating} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum} handleChangeSearch={props.handleChangeSearch} handleChangeToggle={handleChangeToggle} CATEGORIES={CATEGORIES} categoryValue={categoryValue} />
                    </Route>
                    <Route path={`${match.path}/${URL_PARAM_COURSES}`}>
                        <CourseTable isFinishedLoading={props.isFinishedLoadingCourses} userid={userid}  colleges={props.colleges} courses={getNewCourses()} userRatings={props.userRatings} updateScore={props.updateScore} getRatings={props.getRatings}  createRating={props.createRating} nextPage={props.nextPage} previousPage={props.previousPage} pageNum={props.pageNum} handleChangeSearch={props.handleChangeSearch} handleChangeToggle={handleChangeToggle} CATEGORIES={CATEGORIES} categoryValue={categoryValue} />
                    </Route>
                </Switch>
            </>
        )
    // }
}

export default SchoolTables;