import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { updateCourse as updateCourseMutation } from '../graphql/mutations';





function UpdateGEModal(props) {
    const initialFormState = { id: '', isGeneral: true, generalReqID: []}
    const [formData, setFormData] = useState(initialFormState);
    const [isChecked, setIsChecked] = useState([]);
    let selectedCheckboxes = new Set();

    // useEffect(() => {
    //     selectedCheckboxes = new Set();
    // }, [])


    let submitHandler = (e) => {
      e.preventDefault();
    }

    // async function createCategory() {
    //     if (!formData.name || !formData.description) return;
    //     await API.graphql({ query: createCategoryMutation, variables: { input: formData } });
    //     if (formData.image) {
    //       const image = await Storage.get(formData.image);
    //       formData.image = image;
    //     }
    //     props.getCategorys();
    //     setFormData(initialFormState);
    //   }

    const updateGE = async() => {
        if (![...selectedCheckboxes][0]) return;
        try{ 
            const apiData = await API.graphql({ 
                query: updateCourseMutation, 
                variables: { 
                    input: 
                        {
                            "id": props.course.id, 
                            "isGeneral": true,
                            "generalReqID": [...selectedCheckboxes]
                        } 
                } 
            });
            setFormData(initialFormState);
            // setSchools(apiData.data.listSchools.items)
            } catch (e) {
                return e;
            }
    }

    const handleToggle = (e, boxes) => {
        let id = e.target.id
        if (boxes.has(id)) {
            boxes.delete(id);
          } else {
            boxes.add(id);
          }
        // setFormData({ ...formData, 'generalReqID': e.target.value})
        // setIsChecked(!isChecked);
    }


    return (
      <div>
  
        <Modal show={props.showGEModal} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Which Requirement(s) Does {props.course.code} Satisfy?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitHandler}>

                {
                    Object.entries(props.objGE).map(([key, value]) => {
                        return(
                            <Form.Group controlId={key}>
                                <Form.Check type="checkbox" label={value} onChange={(e) => handleToggle(e, selectedCheckboxes)} />
                            </Form.Group>
                        )
                    })
                }
            
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { updateGE(); props.handleClose(); }}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default UpdateGEModal;