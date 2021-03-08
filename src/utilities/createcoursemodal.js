import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { createProfessor as createProfessorMutation } from '../graphql/mutations';
import { createCourse as createCourseMutation } from '../graphql/mutations';


const initialFormState = { name: '', code: '', score: '0', departmentID: '', numCredits: '', isGeneral: 'False' }

function CreateCourseModal(props) {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [schools, setSchools] = useState();
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [selectedSchool, setSelectedSchool] = useState();
    const [isLoading, setIsLoading] = useState(true);

    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    useEffect(() => {
      getData();
    }, []);


    async function getData() {
      let apiData;
      let schoolsFromAPI;
      try {
        apiData = await API.graphql({ query: listSchools });
        schoolsFromAPI = apiData.data.listSchools.items;
  
        await Promise.all(schoolsFromAPI.map(async school => {
          return school;
        }))
      }catch (e) {
        console.log(e);
      }finally {
        if(schoolsFromAPI[0].departments.items[0]){
          setFormData({ ...formData, 'departmentID': schoolsFromAPI[0].departments.items[0].id});
        }
      }
      setSchools(apiData.data.listSchools.items);
      setIsLoading(false);

    }
    
    async function createCourse() {
    if (!formData.name || !formData.code || !formData.departmentID) return;
    await API.graphql({ query: createCourseMutation, variables: { input: formData } });
    setFormData(initialFormState);
    }

      let getSchools = () => {
        if(schools){
          return(
            <>
              <Form.Control as="select" >
                {
                  schools.map((school, indx) => (
                    <option key={indx} value={indx}>{school.name}</option>
                  ))
                }
            </Form.Control>
          </>
          )
        } else {
          return;
        }

      }

      let getDepartments = () => {
        let depts;

        if(selectedSchool){
          depts = schools[selectedSchool].departments.items;
          if(depts.length > 0){
            return(
              <Form.Control as="select">
                {
                  depts.map((department, indx) => (
                    <option key={indx} value={indx}>{department.name}</option>
                  ))
                }
              </Form.Control>
            )
          } else {
            <Form.Control as="select" defaultValue={'DEFAULT'}>
              <option value={'DEFAULT'} disabled>Choose a department</option>
              <option disabled>No departments in this college</option>
            </Form.Control>
          }

        } else {
          return(
            <Form.Control as="select" defaultValue={'DEFAULT'}>
              <option value={'DEFAULT'} disabled>Choose a department</option>
              
            </Form.Control>
          )
        }
        
      }

      let handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
        if(schools[e.target.value].departments.items[0]){
          setFormData({ ...formData, 'departmentID': schools[e.target.value].departments.items[0].id});
        }
        
        getDepartments();
      }

      let handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setFormData({ ...formData, 'departmentID': schools[selectedSchool].departments.items[e.target.value].id});
      }


    return (
      <div style={{paddingLeft: "1rem"}}>
        <Button onClick={handleShow}>Add a Course</Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'name': e.target.value})}>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control type="text" placeholder="Principles of Accounting" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'code': e.target.value})}>
                    <Form.Label>Course Code</Form.Label>
                    <Form.Control type="text" placeholder="ACC 200" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'numCredits': e.target.value})}>
                    <Form.Label>Number of Credits</Form.Label>
                    <Form.Control type="number" placeholder="3" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1" onChange={handleSchoolChange}>
                    <Form.Label>College</Form.Label>
                    {getSchools()}
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1" onChange={handleDepartmentChange}>
                    <Form.Label>Department</Form.Label>
                    {getDepartments()}
                </Form.Group>   
                <Form.Group>
                    <Form.File id="photofile" label="Upload photo" />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { createCourse(); handleClose(); }}>
              Add Course
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateCourseModal;