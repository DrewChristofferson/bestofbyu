import React, { useState, useEffect, useContext } from 'react';
import * as bs from 'react-bootstrap'
import { API, container, Storage } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSchools, listDepartments, getCourse, getCategory, listCategoryItems } from '../graphql/queries';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { ratingsByUserAndContent } from '../graphql/queries';
import { createRating as createRatingMutation } from '../graphql/mutations';
import { updateRating as updateRatingMutation } from '../graphql/mutations';
import { updateCategory as updateCategoryMutation } from '../graphql/mutations';
import { deleteRating as deleteRatingMutation } from '../graphql/mutations';
import SchoolTables from '../university/schooltables'
import Detail from './detail'
import TableView from './tableview'
import CreateCatItem from '../main/createcatitem'

import NewSideBarDesktop from'../main/newsidebardesktop'
import { Auth } from 'aws-amplify';
import AppContext from '../context/context'


function PageTemplate() {
    const [category, setCategory] = useState({});
    const [filter, setFilter] = useState('All');
    const [categoryItems, setCategoryItems] = useState({});
    const [professorsForCourse, setProfessorsForCourse] = useState({});
    const [userRatings, setUserRatings] = useState({});
    const [userid, setUserid] = useState(null);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [isLoadingProfessorsForCourse, setIsLoadingProfessorsForCourse] = useState(true);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [searchFilter, setSearchFilter] = useState('');
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    let colleges = []
    const context = useContext(AppContext)
    const match = useRouteMatch("/category/:cid");
    const history = useHistory();

    useEffect(() => {
        console.log(match.path);
        console.log(match.url);
        console.log(category)
        console.log(filter)
    })

    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
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
        const apiData = await API.graphql({ query: getCategory, variables: {id: match.params.cid} });
        setCategory(apiData.data.getCategory)
        console.log(apiData.data.getCategory)
        } catch (e) {
            return e;
        }
    }

    async function getData(filterValue) {
        let filteredItems = [];
        const apiData = await API.graphql({ query: listCategoryItems, variables: { filter: {categoryID: {eq: match.params.cid}} }});
        const categoryItemsFromAPI = apiData.data.listCategoryItems.items;

        await Promise.all(categoryItemsFromAPI.map(async item => {
            // if(filterValue === 'All'){
            //         filteredItems.push(item)
            // }
            // else{
            //     if(filterValue === item.SubCategory){
            //         filteredItems.push(item)
            //     }
            // }
            return item;
        }))
        

        setCategoryItems(apiData.data.listCategoryItems.items);
        console.log(match.params.cid)
        console.log(apiData.data.listCategoryItems.items);
        setIsLoadingItems(false);
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
                await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": category.id, "numRatings": category.numRatings + 1 } }});
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
                await API.graphql({ query: updateCategoryMutation, variables: { input: { "id": category.id, "numRatings": category.numRatings - 1 } }});
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

    let initPageNum = () => {
        setPageNum(1);
        setPageStartIndex(0);
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

    let clearSearchFilter = () => {
        setSearchFilter('');
    }

    let handleChangeSearch = (val) => {
        setSearchFilter(val);
        setPageNum(1);
        setPageStartIndex(0);
    }

    let handleCreateItem = () => {
        history.push(`${match.url}/create`)
    }

    let handleFilter = (val) => {
        setFilter(val);
        getData(val);
    }
    
    
    // for (let i = 0; i < category.length; i ++) {
    //     colleges.push(category[i])
    // }

    if(!isLoadingItems){
        console.log(category.imgsrc)
        return(
            
            <Switch>
                <Route path={`${match.url}/create`}>
                    <div style={{marginTop: "3rem"}}>
                        <CreateCatItem categoryItems={categoryItems} category={category} getRatings={getRatings} />
                        {/* <Detail 
                            professorsForCourse={professorsForCourse}
                            // getProfsForCourse={getProfessorsForCourse}
                            detailsLoading={isLoadingProfessorsForCourse}
                            updateScore={updateScore} 
                            getRatings={getRatings} 
                            userRatings={userRatings} 
                            departments={departments}
                            createRating={createRating} 
                            isLoading={isLoadingProfessors}
                            nextPage={nextPage}
                            previousPage={previousPage}
                            pageNum={pageNum}
                            pageStartIndex={pageStartIndex}
                            searchFilter={searchFilter}
                            handleChangeSearch={handleChangeSearch}
                        /> */}
                    </div>
                    
                </Route>
                <Route path={`${match.url}/:oid`}>
                    <div style={{marginTop: "3rem"}}>
                        <Detail categoryItems={categoryItems} category={category} createRating={createRating} getRatings={getRatings} />
                        {/* <Detail 
                            professorsForCourse={professorsForCourse}
                            // getProfsForCourse={getProfessorsForCourse}
                            detailsLoading={isLoadingProfessorsForCourse}
                            updateScore={updateScore} 
                            getRatings={getRatings} 
                            userRatings={userRatings} 
                            departments={departments}
                            createRating={createRating} 
                            isLoading={isLoadingProfessors}
                            nextPage={nextPage}
                            previousPage={previousPage}
                            pageNum={pageNum}
                            pageStartIndex={pageStartIndex}
                            searchFilter={searchFilter}
                            handleChangeSearch={handleChangeSearch}
                        /> */}
                    </div>
                    
                </Route>
                

                <Route path={match.path}>
                    <div style={{background: `url(${category.imgsrc}&w=800&dpr=2`}} className="headerContainer" >
                        {/* <img alt="picture" src="https://brightspotcdn.byu.edu/31/bf/faa1cee3405387ff8d0d135ffab1/1810-23-0021-1200-4.jpg" /> */}
                        <h1 id="categoryTitle">{category.name}</h1>
                    </div>
                    <div>
                        <div className="categoryDetails">
                            <div style={{textAlign: "left"}}>
                                <h3>Description</h3>
                                <p>Created By: {category.createdBy ? category.createdBy : 'Best of BYU User' }</p>
                                <p>{category.description}</p>
                            </div>
                            <div>
                                <bs.Dropdown >
                                    <bs.Dropdown.Toggle style={{width: '200px'}} variant="info" id="dropdown-basic">
                                        Filter
                                    </bs.Dropdown.Toggle>

                                    <bs.Dropdown.Menu>
                                        {
                                            category.subCategoryOptions.map(option => {
                                                return(
                                                    <bs.Dropdown.Item onClick={(e) => handleFilter(e.target.text)}>{option}</bs.Dropdown.Item>
                                                )
                                            })
                                        }
                                  
                                    </bs.Dropdown.Menu>
                                </bs.Dropdown>
                            </div>
                            <div>
                                <bs.Button onClick={handleCreateItem}>Create Item</bs.Button>
                            </div>
                            
                        </div>
                        
                        
                        <TableView categoryItems={categoryItems} createRating={createRating} userRatings={userRatings} pageStartIndex={pageStartIndex} filter={filter}/>

                    </div>
                    {/* <div className="headerContainer">
                        <h1 id="categoryTitle">BYU Academics</h1>
                        <NewSideBarDesktop colleges={colleges} initPageNum={initPageNum}/>
                    </div>


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
                                initPageNum={initPageNum}
                                clearSearchFilter={clearSearchFilter}
                            /> */}
                        

                            
                </Route>

            </Switch>
        
        
    )
    } else{
        return(
            <bs.Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </bs.Spinner>
        )
    }
    
}

export default withAuthenticator(PageTemplate);