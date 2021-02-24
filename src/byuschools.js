import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSchools, listDepartments } from './graphql/queries';
import { Switch, Route, useRouteMatch } from 'react-router-dom'
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
            }
        }
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

    let nextPage = (index) => {
        setPageStartIndex(index);
        setPageNum(pageNum + 1);
    }

    let previousPage = (index) => {
        if(index > 20){
            setPageStartIndex(index - 20);
            setPageNum(pageNum - 1);
        } else if (index > 10 && index <= 20) {
            setPageStartIndex(0);
            setPageNum(pageNum - 1);
        }
    }

    let handleChangeSearch = (val) => {
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