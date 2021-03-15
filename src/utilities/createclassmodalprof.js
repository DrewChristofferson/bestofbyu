import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listCourses, listSchools } from '../graphql/queries';
import { createClass as createClassMutation } from '../graphql/mutations';



    
function CreateClassModalProf(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")

    const initialSearchFormState = { professorID: match.params.oid, courseID: ''}
    const [show, setShow] = useState(false);
    const [searchFormData, setSearchFormData] = useState(initialSearchFormState);
    

    const [courses, setCourses] = useState();
    const [myFilteredProfessors, setMyFilteredProfessors] = useState();
    const [selectedProfessor, setSelectedProfessor] = useState();
    const [searchFilter, setSearchFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    
    const handleClose = () => {
      setShow(false);
      setSearchFilter('');
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        getCourses();
    }, []);

    async function getCourses() {
        let apiData;
        let courses;
        try {
          apiData = await API.graphql({ query: listCourses, variables: {limit: 500} });
          courses = apiData.data.listCourses.items;
    
          await Promise.all(courses.map(async course => {
            return course;
          }))
        }catch (e) {
          console.log(e);
        }finally {
          if(courses[0].id){
            setSearchFormData({ ...searchFormData, 'courseID': courses[0].id});
          }
        }
        setCourses(apiData.data.listCourses.items);
        setIsLoading(false);
      }


      async function createClass() {
        if (!searchFormData.professorID || !searchFormData.courseID) return;
        console.log(searchFormData)
        await API.graphql({ query: createClassMutation, variables: { input: searchFormData } });
        //use props as state
        //props.setProfessors([ ...props.professors, formData ]);
        console.log("class was created")
        props.fetchData();
        setSearchFormData(initialSearchFormState);
      }

      let getCoursesFromSearch = () => {
          let filteredCourses = [];
        // console.log(professors)

        if(courses){
            courses.forEach(course => {
                if(course.name.toLowerCase().includes(searchFilter.toLowerCase())){
                    filteredCourses.push(course);
                }
            })


            //TODO: search doesn't reset the default professorID
            // if(filteredProfessors[0].id){
            //     setSearchFormData({ ...searchFormData, 'professorID': filteredProfessors[0].id});
            //   }
            
          return(
            <>
              <Form.Control as="select" >
                {/* <option value={'DEFAULT'} disabled>Choose a college</option> */}

                {
                  filteredCourses.map((course, indx) => (
                    <option key={indx} value={indx}>{course.code} - {course.name}</option>

                  ))
                }
            </Form.Control>
          </>
          )
        } else {
          return;
        }

      }


 

      let handleCourseChange = (e) => {
        let filteredCourses = [];
        if(courses){
          courses.forEach(course => {
              if(course.name.toLowerCase().includes(searchFilter.toLowerCase()) || course.code.toLowerCase().includes(searchFilter.toLowerCase())){
                filteredCourses.push(course);
              }
          })
        }
        console.log(e.target.value);
        console.log(filteredCourses[e.target.value].id)
        console.log(filteredCourses[e.target.value].name)
        setSelectedProfessor(e.target.value);
        if(filteredCourses[e.target.value]){
            setSearchFormData({ ...searchFormData, 'courseID': filteredCourses[e.target.value].id});
          }
      }

      let handleChangeSearch = (val) => {
        // console.log(val);
        let filteredCourses = [];
        setSearchFilter(val);
        if(courses){
          courses.forEach(course => {
              if(course.name.toLowerCase().includes(searchFilter.toLowerCase())){
                filteredCourses.push(course);
              }
          })
        }
        if(filteredCourses[0]){
          setSearchFormData({ ...searchFormData, 'courseID': filteredCourses[0].id});
        }
        // getProfessorsFromSearch();
    }

    let submitHandler = (e) => {
        e.preventDefault();
    }


    return (
      <div style={{paddingLeft: "1rem"}}>
        <Button onClick={handleShow}>Add Course for {props.name}</Button>
        {/* <FontAwesomeIcon icon={faPlusCircle} onClick={handleShow} style={{cursor: "pointer", fontSize: "30px", marginTop: ".7rem"}} /> */}
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Course for this Professor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{paddingLeft: "1rem"}} onSubmit={submitHandler}>
                <Form.Group controlId="exampleForm.ControlInput2" >
            
                    <Form.Control type="text" placeholder="Search for a Course" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2" onChange={handleCourseChange}>
                    <Form.Label>Courses</Form.Label>
                    {getCoursesFromSearch()}
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { createClass(); handleClose(); }}>
              Add Course
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateClassModalProf;