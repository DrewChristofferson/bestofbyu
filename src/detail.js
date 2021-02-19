import React, { useEffect, useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, getCourse, listProfessors } from './graphql/queries'
import { API } from 'aws-amplify'
import ProfessorTable from './professortable'

import catan from './images/catan.jpg'

function Detail(props) {
   const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
   let history = useHistory();
   const [professor, setProfessor] = useState();
   const [course, setCourse] = useState();
   const [professorsForCourse, setProfessorsForCourse] = useState();
   const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);

//    const [classes, setClasses] = useState([]);

    let classes = [];


   useEffect(() => {
       console.log("detail props", props)
       fetchData();
       getProfessorsData();
     }, []);

   useEffect(() => {
       console.log("detail classes", professorsForCourse)
     });



   async function fetchData() {
       if(match.params.type === "professors") {
            try{ 
                const apiData = await API.graphql({ query: getProfessor, variables: { id: match.params.oid }  });
                console.log("course", apiData.data.getProfessor)
                setProfessor(apiData.data.getProfessor)
                console.log(apiData)
            } catch (e) {
                console.log('Error: ' + e)
                console.log(e)
            }
       } else if (match.params.type === "courses"){
            try{ 
                const apiData = await API.graphql({ query: getCourse, variables: { id: match.params.oid }  });

                console.log("course", apiData.data.getCourse);
                setCourse(apiData.data.getCourse);
                // let i = 0;
                // while (i < (apiData.data.getCourse.classes.items).length){
                //     console.log(apiData.data.getCourse.classes.items[i].professor);
                // }
                for (let i = 0; i < apiData.data.getCourse.classes.items.length; i++){
                    console.log("howdy")
                    console.log(apiData.data.getCourse.classes.items[i].professor);
                    classes.push(apiData.data.getCourse.classes.items[i].professor);
                    
                }
                
                
                // getProfessorsData();
            } catch (e) {
                console.log('Error: ' + e)
                console.log(e)
            }
       } else {
           return (
               <h1>No data</h1>
           )
       }

   }

   async function getProfessorsData() {
    let myClasses = [];
    let profs = [];
    
    const apiData = await API.graphql({ query: getCourse, variables: { id: match.params.oid } });
    const professorsForCourseFromAPI = apiData.data.getCourse.classes.items;
    console.log("****************", apiData.data.getCourse.classes.items)

    await Promise.all(professorsForCourseFromAPI.map(async professor => {
    return professor;
    })).then(values => {
        myClasses.push(values)
    })

    // myClasses = apiData.data.getCourse.classes.items;
    console.log("my classes are ", apiData.data.getCourse.classes.items);

    for (let i = 0; i < (apiData.data.getCourse.classes.items).length; i++){
        console.log(apiData.data.getCourse.classes.items[i].professor)
        profs.push(apiData.data.getCourse.classes.items[i].professor);
    }
    
    setProfessorsForCourse(profs);
    setIsLoadingProfessors(false);
    //return apiData.data.getCourse.classes.items;
    
}

   let getProfessors =  () => {
        // let professors = props.professors;
        let filteredProfessors = [];
        let paginatedProfessors = [];
        
        let endingIndex;

        

        console.log(professorsForCourse);

        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (professorsForCourse).sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
        
        for (let i = 0; i < professorsForCourse.length; i++){
            professorsForCourse[i].ranking = i + 1;
            if(professorsForCourse[i].name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === professorsForCourse[i].id){
                        professorsForCourse[i].userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredProfessors.push(professorsForCourse[i])
            }
            
        }

        for (let i = props.pageStartIndex; paginatedProfessors.length < 10; i++){
                
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }
        console.log(paginatedProfessors)
        return [paginatedProfessors, filteredProfessors.length, endingIndex];
    }

   let returnProfessors = () => {
       if (isLoadingProfessors){
            return(
                <bs.Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </bs.Spinner>
            )
       } else {
            return(
                <ProfessorTable 
                    professors={getProfessors()} 
                    updateScore={props.updateScore} 
                    getRatings={props.getRatings} 
                    userRatings={props.userRatings} 
                    createRating={props.createRating} 
                    isLoading={props.isLoading}
                    nextPage={props.nextPage}
                    previousPage={props.previousPage}
                    pageNum={props.pageNum}
                    pageStartIndex={props.pageStartIndex}
                    searchFilter={props.searchFilter}
                    handleChangeSearch={props.handleChangeSearch}
                />
            )
        }
   }



   if(!professor && !course){
       console.log("hello",professor)
       return(
        <bs.Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </bs.Spinner>
    )
   } else if (!professor){
       return(
            <bs.Container fluid style={{marginRight: "3rem", marginLeft: "3rem"}}>
                <bs.Row style={{paddingTop: "1rem"}}>
                    <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
                </bs.Row>
                <bs.Row style={{paddingTop: "3rem"}}>
                    <bs.Col sm="2">
                        <img className="profile" alt={course.name} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
                    </bs.Col>
                    <bs.Col md="6" style={{paddingLeft: "5rem"}}>
                        <bs.Row>
                            <bs.Col>
                                <h2>{course.name}</h2>
                            </bs.Col>
                            <bs.Col>
                                
                            </bs.Col>
                        </bs.Row>
                        <bs.Row>
                            <h5>{ course.description }</h5>
                        </bs.Row>
                        <bs.Row>
                            <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                            <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                            <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}


                        </bs.Row>
                    
                    
                        
                    </bs.Col>
                    <bs.Col md="4">
                        <bs.Row>
                            
                        <h4>Score: {course.score}</h4>

                        </bs.Row>
                        <bs.Row style={{marginTop: "10px"}}>
                            
                            <h5>2nd in <Link to={`schools/${course.departmentID}/professors`}>{ course.department.name}</Link>{"\n"}</h5> 
                        </bs.Row>
                        <bs.Row>
                            <h5>4th in <Link to="/table1">{ course.department.school.name}</Link></h5>

                        </bs.Row>
                        <bs.Row>
                            <h5>9th in <Link to="/table1">All professors</Link></h5>

                        </bs.Row>
                    </bs.Col>
                    
                </bs.Row>

                <bs.Row style={{marginTop: "3rem"}}>
                    <bs.Col>
                        <bs.Tabs defaultActiveKey="professors" id="controlled-tab-example">
                        <bs.Tab eventKey="professors" title="Professors">
                                {returnProfessors()}
                            </bs.Tab>
                            <bs.Tab eventKey="about" title="About">
                                <strong>Description: </strong>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                            </bs.Tab>
                            <bs.Tab eventKey="discussion" title="Discussion">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                            </bs.Tab>
                            <bs.Tab eventKey="pictures" title="Pictures" >
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                            </bs.Tab>
                        </bs.Tabs>
                    </bs.Col>
                </bs.Row>
            </bs.Container>
       );
   }
   else{
       console.log("bye", professor)
    return(
        <bs.Container fluid style={{marginRight: "3rem", marginLeft: "3rem"}}>
            <bs.Row style={{paddingTop: "1rem"}}>
                <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
            </bs.Row>
            <bs.Row style={{paddingTop: "3rem"}}>
                <bs.Col sm="2">
                    <img className="profile" alt={professor.name} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
                </bs.Col>
                <bs.Col md="6" style={{paddingLeft: "5rem"}}>
                    <bs.Row>
                        <bs.Col>
                            <h2>{professor.name}</h2>
                        </bs.Col>
                        <bs.Col>
                            
                        </bs.Col>
                    </bs.Row>
                    <bs.Row>
                        <h5>{ professor.title }</h5>
                    </bs.Row>
                    <bs.Row>
                        <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}


                    </bs.Row>
                   
                  
                    
                </bs.Col>
                <bs.Col md="4">
                    <bs.Row>
                        
                      <h4>Score: {professor.score}</h4>

                    </bs.Row>
                    <bs.Row style={{marginTop: "10px"}}>
                        
                        <h5>2nd in <Link to={`schools/${professor.departmentID}/professors`}>{ professor.department.name}</Link>{"\n"}</h5> 
                    </bs.Row>
                    <bs.Row>
                        <h5>4th in <Link to="/table1">{ professor.department.school.name}</Link></h5>

                    </bs.Row>
                    <bs.Row>
                        <h5>9th in <Link to="/table1">All professors</Link></h5>

                    </bs.Row>
                </bs.Col>
                
            </bs.Row>

            <bs.Row style={{marginTop: "3rem"}}>
                <bs.Col>
                    <bs.Tabs defaultActiveKey="home" id="controlled-tab-example">
                        <bs.Tab eventKey="home" title="About">
                            <strong>Description: </strong>
                            
                    
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                        <bs.Tab eventKey="profile" title="Discussion">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                        <bs.Tab eventKey="contact" title="Pictures" >
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                    </bs.Tabs>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
   }
    

}

export default Detail;