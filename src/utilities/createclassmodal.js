import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listProfessors, listSchools } from '../graphql/queries';
import { createClass as createClassMutation } from '../graphql/mutations';



    
function CreateClassModal(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")

    const initialSearchFormState = { professorID: '', courseID: match.params.oid}
    const [show, setShow] = useState(false);
    const [searchFormData, setSearchFormData] = useState(initialSearchFormState);
    

    const [professors, setProfessors] = useState();
    const [selectedProfessor, setSelectedProfessor] = useState();
    const [searchFilter, setSearchFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getProfessors();
    }, []);

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


      async function createClass() {
        if (!searchFormData.professorID || !searchFormData.courseID) return;
        console.log(searchFormData)
        await API.graphql({ query: createClassMutation, variables: { input: searchFormData } });
        //use props as state
        //props.setProfessors([ ...props.professors, formData ]);
        console.log("class was created")
        setSearchFormData(initialSearchFormState);
        
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
  
  export default CreateClassModal;