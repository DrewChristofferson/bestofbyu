import React, { useEffect, useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, getCourse } from './graphql/queries'
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


    


   useEffect(() => {
       fetchData();
     }, []);


   async function fetchData() {
       if(match.params.type === "professors") {
            try{ 
                const apiData = await API.graphql({ query: getProfessor, variables: { id: match.params.oid }  });
                setProfessor(apiData.data.getProfessor)
                setComments(apiData.data.getProfessor.comments.items)
                setIsLoadingComments(false);
            } catch (e) {
                console.log('Error: ' + e)
            }
       } else if (match.params.type === "courses"){
            try{ 
                const apiData = await API.graphql({ query: getCourse, variables: { id: match.params.oid }  });

                setCourse(apiData.data.getCourse);
                let classes = []; //classes are an instance of a professor that teaches a course
                for (let i = 0; i < apiData.data.getCourse.classes.items.length; i++){
                    classes.push(apiData.data.getCourse.classes.items[i].professor); 
                }
                setProfessorsForCourse(classes);
                setIsLoadingProfessors(false);
                setIsLoadingCourse(false);
            } catch (e) {
                console.log('Error: ' + e)
            }
       } else {
           return (
               <h1>No data</h1>
           )
       }
   }

    let getProfessors =  () => {
        let filteredProfessors = [];
        let paginatedProfessors = [];
        let endingIndex;


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
        return [paginatedProfessors, filteredProfessors.length, endingIndex];
    }

   let returnComments = () => {

        if(!isLoadingComments) {
            if(comments[0]){
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



   

   let returnProfessors = () => {
       if (isLoadingCourse){
            return(
                <bs.Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </bs.Spinner>
            )
       } else {   
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
       return(
        <bs.Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </bs.Spinner>
    )
   } else if (course){
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