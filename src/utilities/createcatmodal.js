import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { createCategory as createCategoryMutation } from '../graphql/mutations';


const initialFormState = { name: '', description: '', numRatings: '0'}

function CreateCatModal(props) {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    async function createCategory() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createCategoryMutation, variables: { input: formData } });
        if (formData.image) {
          const image = await Storage.get(formData.image);
          formData.image = image;
        }
        setFormData(initialFormState);
      }


    return (
      <div style={{paddingLeft: "1rem"}}>
        <div className="banner">

        </div>
        <Button onClick={handleShow}>Add a New Category</Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'name': e.target.value})}>
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control type="text" placeholder="Gift Ideas" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1" onChange={e => setFormData({ ...formData, 'description': e.target.value})}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Give a brief description..."    />
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
            <Button variant="primary" onClick={() => { createCategory(); handleClose(); }}>
              Add Category
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateCatModal;