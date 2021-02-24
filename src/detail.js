import React, { useEffect, useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, getCourse, listProfessors, listProfessorComments } from './graphql/queries'
import { API } from 'aws-amplify'
import ProfessorTable from './professortable'
import CreateModalClass from './createmodalclass'
import img1 from './images/detailplaceholders/one.jpg'
import img2 from './images/detailplaceholders/two.jpg'
import img3 from './images/detailplaceholders/three.jpg'
import img4 from './images/detailplaceholders/four.jpg'
import img5 from './images/detailplaceholders/five.jpg'
import img6 from './images/detailplaceholders/six.jpg'
import img7 from './images/detailplaceholders/seven.jpg'

import catan from './images/catan.jpg'

function Detail(props) {
   const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
   let history = useHistory();
   const [professor, setProfessor] = useState();
   const [course, setCourse] = useState();
   const [professorsForCourse, setProfessorsForCourse] = useState();
   const [comments, setComments] = useState();
   const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
   const [isLoadingCourse, setIsLoadingCourse] = useState(true);
   const [isLoadingComments, setIsLoadingComments] = useState(true);

//    const [classes, setClasses] = useState([]);

    let classes = [];


   useEffect(() => {
       console.log("detail props", props)
       fetchData();
     }, []);

   useEffect(() => {
       console.log("detail classes", professorsForCourse)
     });



   async function fetchData() {
       if(match.params.type === "professors") {
            try{ 
                const apiData = await API.graphql({ query: getProfessor, variables: { id: match.params.oid }  });
                console.log("professor", apiData.data.getProfessor)
                setProfessor(apiData.data.getProfessor)
                setComments(apiData.data.getProfessor.comments.items)
                setIsLoadingComments(false);
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
                
                setIsLoadingCourse(false);
                
                
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

//    async function getComments() {
//        if (professor) {
//         try{ 
//             const apiData = await API.graphql({ query: listProfessorComments, filter: { professorID: { eq: match.params.oid }  }});
//             console.log("comments_____________________", apiData.data.listProfessorComments.items)
//             setComments(apiData.data.listProfessorComments.items)
            
//         } catch (e) {
//             console.log('Error: ' + e)
//             console.log(e)
//         } finally {
//             setIsLoadingComments(false)
//         }
//        }
//    }

   let returnComments = () => {
       console.log("are the comments loading?", isLoadingComments)
       console.log(comments)

        if(!isLoadingComments) {
            if(comments[0]){
                console.log("were in!!!")
                comments.forEach(comment => {
                    console.log(comment.content)
                })
                
                return( 
                    comments.map((comment) => ( 
                        <p style={{fontSize: "1.4rem"}}>{comment.content}</p>
                    )
                    )
                )    
            } else {
                return(
                    <p>No comments for {professor.name}.</p>
                )
            }
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
       if (isLoadingCourse){
            return(
                <bs.Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </bs.Spinner>
            )
       } else {
            getProfessorsData();
            if (!isLoadingProfessors){
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
            } else {
                return;
            }
            
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
                            <bs.Col style={{padding: "0"}}>
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
                        <bs.Tab eventKey="professors" title="Professors" style={{paddingTop: "3em"}}>
                                <CreateModalClass />
                                {returnProfessors()}
                            </bs.Tab>
                            <bs.Tab eventKey="about" title="About">
                                <h3 style={{paddingTop:"2rem"}}>Description</h3>
                                <p>Write an unbiased description of {course.name}. </p>
                                <bs.Button variant="info">Edit Description</bs.Button>
                            </bs.Tab>
                            <bs.Tab eventKey="discussion" title="Discussion">
                                <h3 style={{paddingTop:"2rem"}}>Comments</h3>
                                <p>No comments yet for {course.name}</p>
                                <bs.Form style={{paddingLeft: "1rem"}}>
                                    <bs.Form.Group controlId="exampleForm.ControlInput" >
                                        <bs.Form.Control type="text" placeholder="Post a new comment..." onChange={(e) => console.log("new comment",e.target.value)}/>
                                    </bs.Form.Group>
                                    <bs.Button variant="primary">Post Comment</bs.Button>
                                </bs.Form>

                            </bs.Tab>
                            <bs.Tab eventKey="pictures" title="Pictures" >
                                <h3 style={{paddingTop:"2rem"}}>Picutres</h3>
                                <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{paddingTop: "5em"}}>
                                    <bs.Row>
                                        <bs.Col lg="4">
                                            <img src={img1} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col lg="4">
                                            <img src={img2} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col lg="4">
                                            <img src={img3} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                    </bs.Row>
                                    <bs.Row style={{paddingTop: "2em"}}>
                                        <bs.Col>
                                            <img src={img4} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            <img src={img5} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            <img src={img6} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                    </bs.Row>
                                    <bs.Row style={{paddingTop: "2em"}}>
                                        <bs.Col>
                                            <img src={img7} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            
                                        </bs.Col>
                                        <bs.Col>
                                            
                                        </bs.Col>
                                    </bs.Row>
                                </bs.Container>
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
                    <bs.Row >
                        <bs.Col style={{padding: "0"}}>
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
                            <h3 style={{paddingTop:"2rem"}}>Description</h3>
                            <p>Write an unbiased description of {professor.name}. </p>
                            <bs.Button variant="info">Edit Description</bs.Button>
                        </bs.Tab>
                        <bs.Tab eventKey="profile" title="Discussion">
                            <h3 style={{paddingTop:"2rem"}}>Comments</h3>
                            {returnComments()}
                            <bs.Form style={{paddingLeft: "1rem"}}>
                                <bs.Form.Group controlId="exampleForm.ControlInput" >
                                    <bs.Form.Control type="text" placeholder="Post a new comment..." onChange={(e) => console.log("new comment",e.target.value)}/>
                                </bs.Form.Group>
                                <bs.Button variant="primary">Post Comment</bs.Button>
                            </bs.Form>
                        </bs.Tab>
                        <bs.Tab eventKey="contact" title="Pictures" >
                            <h3 style={{paddingTop:"2rem"}}>Picutres</h3>
                            <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{paddingTop: "5em"}}>
                                <bs.Row>
                                    <bs.Col lg="4">
                                        <img src={img1} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col lg="4">
                                        <img src={img2} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col lg="4">
                                        <img src={img3} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                </bs.Row>
                                <bs.Row style={{paddingTop: "2em"}}>
                                    <bs.Col>
                                        <img src={img4} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        <img src={img5} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        <img src={img6} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                </bs.Row>
                                <bs.Row style={{paddingTop: "2em"}}>
                                    <bs.Col>
                                        <img src={img7} height="400em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        
                                    </bs.Col>
                                    <bs.Col>
                                        
                                    </bs.Col>
                                </bs.Row>
                            </bs.Container>
                        </bs.Tab>
                    </bs.Tabs>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
   }
    

}

export default Detail;