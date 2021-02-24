import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listProfessors, listSchools } from './graphql/queries';
import { createClass as createClassMutation } from './graphql/mutations';



    
function CreateModalClass(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")

    const initialFormState = { name: '', title: 'Professor', score: '0', departmentID: '' }
    const initialSearchFormState = { professorID: '', courseID: match.params.oid}
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [searchFormData, setSearchFormData] = useState(initialSearchFormState);
    

    const [schools, setSchools] = useState();
    const [professors, setProfessors] = useState();
    const [selectedProfessor, setSelectedProfessor] = useState();
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [selectedSchool, setSelectedSchool] = useState();
    const [isLoading, setIsLoading] = useState(true);

    

    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getData();
        getProfessors();
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

    async function getProfessors() {
        let apiData;
        let professors;
        try {
          apiData = await API.graphql({ query: listProfessors });
          professors = apiData.data.listProfessors.items;
    
          await Promise.all(professors.map(async professor => {
            return professor;
          }))
        }catch (e) {
          console.log(e);
        }finally {
          if(professors[0].id){
            setSearchFormData({ ...searchFormData, 'professorID': professors[0].id});
          }
        }
        setProfessors(apiData.data.listProfessors.items);
        setIsLoading(false);
      }

    async function createProfessor() {
        if (!formData.professorName) return;
        console.log(formData)
        await API.graphql({ query: createClassMutation, variables: { input: formData } });
        //use props as state
        //props.setProfessors([ ...props.professors, formData ]);
        setFormData(initialSearchFormState);
      }

      async function createClass() {
        if (!searchFormData.professorID || !searchFormData.courseID) return;
        console.log(searchFormData)
        await API.graphql({ query: createClassMutation, variables: { input: searchFormData } });
        //use props as state
        //props.setProfessors([ ...props.professors, formData ]);
        console.log("class was created")
        setFormData(initialFormState);
        
      }

      let getProfessorsFromSearch = () => {
          let filteredProfessors = [];
        // console.log(professors)

        if(professors){
            professors.forEach(professor => {
                if(professor.name.toLowerCase().includes(searchFilter.toLowerCase())){
                    filteredProfessors.push(professor);
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
                  filteredProfessors.map((professor, indx) => (
                    <option key={indx} value={indx}>{professor.name}</option>

                  ))
                }
            </Form.Control>
          </>
          )
        } else {
          return;
        }

      }

      let getSchools = () => {
        if(schools){
          return(
            <>
              <Form.Control as="select" >
                {/* <option value={'DEFAULT'} disabled>Choose a college</option> */}

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
        console.log(selectedSchool, schools);
        //setPickDepartments(schools[schoolID].departments.items);

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
        console.log(e);
        setSelectedSchool(e.target.value);
        if(schools[e.target.value].departments.items[0]){
          setFormData({ ...formData, 'departmentID': schools[e.target.value].departments.items[0].id});
        }
        
        getDepartments();
      }

      let handleDepartmentChange = (e) => {
        console.log(e);
        setSelectedDepartment(e.target.value);
        setFormData({ ...formData, 'departmentID': schools[selectedSchool].departments.items[e.target.value].id});
      }

      let handleProfessorChange = (e) => {
        console.log(e.target.value);
        console.log(professors[e.target.value].id)
        setSelectedProfessor(e.target.value);
        if(professors[e.target.value]){
            setSearchFormData({ ...searchFormData, 'professorID': professors[e.target.value].id});
          }
      }

      let handleChangeSearch = (val) => {
        // console.log(val);
        setSearchFilter(val);
        // getProfessorsFromSearch();
    }


    return (
      <div style={{paddingLeft: "1rem"}}>
        <Button onClick={handleShow}>Add a New Professor for this Course</Button>
        {/* <FontAwesomeIcon icon={faPlusCircle} onClick={handleShow} style={{cursor: "pointer", fontSize: "30px", marginTop: ".7rem"}} /> */}
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Professor for this Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{paddingLeft: "1rem"}}>
                <Form.Group controlId="exampleForm.ControlInput2" >
            
                    <Form.Control type="text" placeholder="Search for a Professor" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2" onChange={handleProfessorChange}>
                    <Form.Label>Professors</Form.Label>
                    {getProfessorsFromSearch()}
                </Form.Group>
            </Form>
            {/* <Form>
                <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'name': e.target.value})}>
                    <Form.Label>Professor Name</Form.Label>
                    <Form.Control type="text" placeholder="James Smith" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1" onChange={e => setFormData({ ...formData, 'title': e.target.value})}>
                    <Form.Label>Title</Form.Label>

                          <Form.Control as="select">
                            <option>Professor</option>
                            <option>Associate Professor</option>
                            <option>Assistant Professor</option>
                            <option>Other</option>
                          </Form.Control>

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
            </Form> */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { createClass(); handleClose(); }}>
              Add Professor
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateModalClass;