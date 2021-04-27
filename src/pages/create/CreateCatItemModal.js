import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useState, useEffect } from "react"
import { useHistory, useRouteMatch } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import ToggleButton from "react-bootstrap/ToggleButton"
import { API } from 'aws-amplify'
import { createCategoryItem as createCategoryItemMutation } from '../../graphql/mutations';
import { createApi } from 'unsplash-js';
import styled from 'styled-components'

const radios = [
    { name: 'From Computer', value: '1' },
    { name: 'Seach Stock Images', value: '2' }
  ];

const FormContainer = styled.div`
    padding: 20px;
    text-align: left;
`
const SubmitButton = styled(Button)`
    margin-top: 20px;
`

function CreateCatItemModal(props) {
    const match = useRouteMatch("/category/:cid")
    const initialFormState = { id: '', categoryID: match.params.cid, name: '', description: '', imgsrc: '', content: '', score: '0', SubCategory: props.category?.subCategoryOptions ? props.category.subCategoryOptions[0] : '', customFields: []}
    const unsplashAccessKey = 'Vi_vrZ3sI2PbvoBYAnrYfDEbqTSa75R7_zcO0lHR7z8';
    const [photos, setPhotos] = useState([]);
    const [show, setShow] = useState(false);
    const [isValidItem, setIsValidItem] = useState(true);
    const [customFields, setCustomFields] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selected, setSelected] = useState();
    const [formData, setFormData] = useState(initialFormState);
    const [radioValue, setRadioValue] = useState('1');
    const history = useHistory();
    const unsplash = createApi({
        accessKey: unsplashAccessKey,
        // `fetch` options to be sent with every request
        // headers: { 'X-Custom-Header': 'foo' },
      });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log(formData)
    })

    let submitHandler = (e) => {
      e.preventDefault();
    }

    async function createCategoryItem() {
        if (!formData.name || !formData.description){
            setIsValidItem(false);
        } else {
            let newID = formData.name.replaceAll(' ','-').toLowerCase();
            // setFormData({ ...formData, 'id': newID})

            let response = await API.graphql({ query: createCategoryItemMutation, variables: { input: formData } });
            if (formData.image) {
                const image = await Storage.get(formData.image);
                formData.image = image;
                }
    
            // props.getData();
            setFormData(initialFormState);
            handleClose();
            history.push(`/category/${props.category.id}/item/${response.data.createCategoryItem.id}`)
            // history.push(`/category/${props.category.id}`) 
        }
      }

    const getPhotos = () => {
        unsplash.search.getPhotos({ query: searchFilter, orientation: 'landscape' }).then(result => {
            if (result.errors) {
              // handle error here
              console.log('error occurred: ', result.errors[0]);
            } else {
              // handle success here
              const photo = result.response;
              console.log(photo);
              let arrUrls = [];
              photo.results.forEach(photo => {
                  arrUrls.push([photo.urls.raw, photo.urls.thumb]);
              })
              setPhotos(arrUrls);
            }
          });
    }
    
    let handleCustomFieldsChange = (text, key) => {
        let tempArr = [];
        let tempObj = {};

        customFields.forEach(element => {
            if(element.key != key) {
                tempArr.push(element)
            }
        })
        tempObj.key = key;
        tempObj.value = text;
        tempArr.push(tempObj);
        setCustomFields(tempArr);
        setFormData({ ...formData, 'customFields': tempArr})
    }

    let photoClickHandler = (id, link) => {
        console.log(`photo ${id} clicked`);
        if (id === selected){
            setSelected(null);
            setFormData({ ...formData, 'imgsrc': ''})
        } else {
            setSelected(id);
            setFormData({ ...formData, 'imgsrc': link[0]})
        }
        console.log(formData)
    }

    let handleChangeSearch = (val) => {
        setSearchFilter(val);
    }

    let submitHandlerPhotos = (e) => {
        e.preventDefault();
        getPhotos();
    }

    const updateName = (e) => {
        e.preventDefault();
        setFormData({...formData, 'name': e.target.value, 'id': e.target.value.replaceAll(' ','-').toLowerCase()});
    }

    let handleFormSubmit = (e) => {
        e.preventDefault();
        createCategoryItem();
    }


    return (
      <div>

        <Button onClick={handleShow}>Add Item</Button>
  
        <Modal show={show} onHide={handleClose} dialogClassName="create-modal">
          <Modal.Header closeButton>
            <Modal.Title>Create New {props.category.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <FormContainer>
                <div>
                    {
                        isValidItem ?
                        <></>
                        :
                        <p style={{color: 'red'}}>Name and Description are required.</p>
                    }
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlInput1" onChange={e => updateName(e)}>
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" value={formData.name}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1" onChange={e => setFormData({ ...formData, 'description': e.target.value})}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3}  />
                        </Form.Group>
                        {
                            props.category?.subCategoryOptions?.length ?
                                <Form.Group controlId="exampleForm.ControlDropdown1" onChange={e => setFormData({ ...formData, 'SubCategory': e.target.value})}>
                                    <Form.Label className="my-1 mr-2" >
                                        Choose a SubCategory
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        {
                                            props.category.subCategoryOptions.map((category, index) => {
                                                return(
                                                    <option value={category} key={`subcategory${index}`}>{category}</option>
                                                )
                                            })
                                        }
                        
                                    </Form.Control>
                                </Form.Group>
                                :
                                <></>
                        }
                        {
                            props.category?.customFields?.length ?
                                <div>        
                                    <h4>Custom Fields</h4>
                                    <Form.Group controlId="exampleForm.ControlDropdown2" >
                                        {
                                            props.category.customFields.map((category, index) => {
                                                return(
                                                    <div key={`customfield${index}`}>
                                                        <Form.Label >{category}</Form.Label>
                                                        <Form.Control type="text" onChange={e => handleCustomFieldsChange(e.target.value, category)}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Form.Group>
                                </div>
                                :
                                <></>
                        }
                        
                        </Form>
                        <div>
                            <div>
                                <form>
                                    <p style={{marginBottom: '.25rem'}}>Choose a Photo</p>
                                    <input type="text" id="photos" placeholder="Search" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                                    <button onClick={submitHandlerPhotos}>Search Pictures</button>
                                </form>
                            </div>
                            <div className="testImageContainer">
                                {
                                    photos ?
                                    photos.map((link, index) => {
                                        return(
                                            <div id={index} key={`photo${index}`}>
                                                <img alt="test" src={link[1]} onClick={() => photoClickHandler(index, link)} className={index === selected ? "testImageClicked" : "testImage"}/>
                                            </div>
                                        )
                                    }) 
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                </div>
            </FormContainer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => createCategoryItem()}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );   
  }
  
  export default CreateCatItemModal;