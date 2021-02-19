import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSchools, listDepartments, listProfessors, getCourse } from './graphql/queries';
import { Link, Redirect, Switch, Router, Route, useRouteMatch } from 'react-router-dom'
import { ratingsByUserAndContent } from './graphql/queries';
import { createRating as createRatingMutation } from './graphql/mutations';
import { updateRating as updateRatingMutation } from './graphql/mutations';
import { deleteRating as deleteRatingMutation } from './graphql/mutations';
import SchoolTables from './schooltables'
import Detail from './detail'
import SchoolSideBar from './schoolsidebar'
import { Auth } from 'aws-amplify';


function BYUSchools() {
    const [schools, setSchools] = useState({});
    const [departments, setDepartments] = useState({});
    const [professorsForCourse, setProfessorsForCourse] = useState({});
    const [userRatings, setUserRatings] = useState({});
    const [userid, setUserid] = useState(null);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [searchFilter, setSearchFilter] = useState('');
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    let match = useRouteMatch();
    let colleges = []

    useEffect(() => {
        fetchData();
        getData();
        getProfessorsData();
      }, []);

    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then (user => {
            setUserid(user.username);
            getRatings(user.username);
        }).catch(err => console.log(err));
    }, []);

    async function fetchData() {
        try{ 
        const apiData = await API.graphql({ query: listSchools });
        setSchools(apiData.data.listSchools.items)
        } catch (e) {
            return e;
        }
    }

    async function getData() {
        const apiData = await API.graphql({ query: listDepartments });
        const departmentsFromAPI = apiData.data.listDepartments.items;

        await Promise.all(departmentsFromAPI.map(async department => {
          return department;
        }))

        setDepartments(apiData.data.listDepartments.items);
        setIsLoadingDepartments(false);
    }

    // async function getProfessorsData() {
    //     const apiData = await API.graphql({ query: listProfessors, variables: { filter: { departmentID: { eq: "msb8" }}} });
    //     const professorsForCourseFromAPI = apiData.data.listProfessors.items;

    //     await Promise.all(professorsForCourseFromAPI.map(async professor => {
    //     return professor;
    //     }))

    //     setProfessorsForCourse(apiData.data.listProfessors.items);
    //     setIsLoadingProfessors(false);
    // }

    async function getProfessorsData() {
        // let myClasses = [];
        // const apiData = await API.graphql({ query: getCourse, variables: { id: "48aa632c-c31f-46ca-8391-9f25132b2ba4" } });
        // const professorsForCourseFromAPI = apiData.data.getCourse.classes.items;
        // console.log("****************", apiData.data.getCourse.classes.items)

        // await Promise.all(professorsForCourseFromAPI.map(async professor => {
        // return professor;
        // })).then(values => {
        //     myClasses.push(values)
        // })

        // console.log("my classes are ", myClasses)
        // setProfessorsForCourse(myClasses);
        // setIsLoadingProfessors(false);
        //return apiData.data.getCourse.classes.items;
        
    }

    async function updateScore(id, score, increment, mutationName) {
        console.log("updating score.......................")
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
            } finally {
                getData();
                getProfessorsData();
            }
        } else if (ratingIdFromAPI[0].ratingType === type){
            type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
            try {
                await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }finally {
               getData();
               getProfessorsData();
            }
        } else {
            type === VOTE_UP ? score += 1 : score -= 1;
            try {
                await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                getData();
                getProfessorsData();
            }
        }
    }

    //onload getRatings gets passed the username from UseState on line 41. TODO: figure out how to get the userstate right away
    async function getRatings(user) {
        console.log("the user is", user)
        const userRatingsData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": user }});
        const userRatingsFromAPI = userRatingsData.data.ratingsByUserAndContent.items;

        await Promise.all(userRatingsFromAPI.map(async rating => {
            return rating;
        }))

        setUserRatings(userRatingsData.data.ratingsByUserAndContent.items);
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

    let handleChangeSearch = (val) => {
        // console.log(val);
        setSearchFilter(val);
        setPageNum(1);
        setPageStartIndex(0);
    }
    
    
    for (let i = 0; i < schools.length; i ++) {
        colleges.push(schools[i])
    }

    return(
        <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{textAlign: "left"}}>
            <Switch>
                <Route path={`${match.path}/:schId/:deptId/:type/:oid`}>
                    <Detail 
                        updateScore={updateScore} 
                        getRatings={getRatings} 
                        userRatings={userRatings} 
                        createRating={createRating} 
                        isLoading={isLoadingProfessors}
                        nextPage={nextPage}
                        previousPage={previousPage}
                        pageNum={pageNum}
                        pageStartIndex={pageStartIndex}
                        searchFilter={searchFilter}
                        handleChangeSearch={handleChangeSearch}
                    />
                </Route>
                <Route path="/schools">

                    <bs.Row className=" pb-5 pl-3 flex-grow-0 flex-shrink-0 border-bottom shadow-sm" >
                        <SchoolSideBar colleges={colleges} />
                        <bs.Col md="9">

                                <Switch>

                                    <Route path={`${match.path}/:schId/:deptId`}>
                                        <SchoolTables 
                                            updateScore={updateScore} 
                                            getRatings={getRatings} 
                                            userRatings={userRatings} 
                                            createRating={createRating} 
                                            departments={departments} 
                                            isLoading={isLoadingDepartments}
                                            nextPage={nextPage}
                                            previousPage={previousPage}
                                            pageNum={pageNum}
                                            pageStartIndex={pageStartIndex}
                                            searchFilter={searchFilter}
                                            handleChangeSearch={handleChangeSearch}
                                        />
                                    </Route>
                                    <Route path={match.path}>
                                        <h2>Select a Department</h2>
                                    </Route>
                                </Switch>

                        </bs.Col>
                        
                    </bs.Row>
                </Route>

            </Switch>
        

        </bs.Container>
    )
}

export default withAuthenticator(BYUSchools);