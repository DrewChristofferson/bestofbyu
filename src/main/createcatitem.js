import React, {useEffect, useState} from 'react'
import { createApi } from 'unsplash-js';
import { useHistory } from 'react-router-dom'
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import ToggleButton from "react-bootstrap/ToggleButton"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { createCategoryItem as createCategoryItemMutation } from '../graphql/mutations';
import styled from 'styled-components'

const initialFormState = { categoryID: '', name: '', description: '', imgsrc: '', content: '', score: '0', SubCategory: ''}

const radios = [
    { name: 'From Computer', value: '1' },
    { name: 'Seach Stock Images', value: '2' }
  ];

const FormContainer = styled.div`
    width: 80%;
    border: 2px solid gray;
    padding: 40px;
    border-radius: 5px;
    text-align: left;
`
const SubmitButton = styled(Button)`
    margin-top: 20px;
`

function CreateCategoryItem(props) {
    const unsplashAccessKey = 'Vi_vrZ3sI2PbvoBYAnrYfDEbqTSa75R7_zcO0lHR7z8';
    const [photos, setPhotos] = useState([]);
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
    
    useEffect(() => {
        setFormData({ ...formData, 'categoryID': props.category.id})
    }, [])

    useEffect(() => {
        console.log(formData);
        console.log(props.category.subCategoryOptions)
    })

    async function createCategoryItem() {
        if (!formData.name || !formData.description) return;
        let response = await API.graphql({ query: createCategoryItemMutation, variables: { input: formData } });
        console.log(response);
        if (formData.image) {
          const image = await Storage.get(formData.image);
          formData.image = image;
        }
        // props.getCategorys();
        setFormData(initialFormState);
        history.push(`/category/${props.category.id}/${response.data.createCategoryItem.id}`)
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

    let handleChangeSearch = (val) => {
        // console.log(val);
        setSearchFilter(val);
        // getProfessorsFromSearch();
    }

    let submitHandlerPhotos = (e) => {
        e.preventDefault();
        getPhotos();
    }

    let submitHandler = (e) => {
        e.preventDefault();
    }

    let handleFormSubmit = (e) => {
        e.preventDefault();
        createCategoryItem();
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

    // if(photos[0]){
    //     photos.map(link => {
    //         return(
    //             <img alt="test" src={link} />
    //         )
    //     })  
    // }
    return (
        <FormContainer>
            <div>
                <h1>Create New</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'name': e.target.value})}>
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control type="text" placeholder="Gift Ideas" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1" onChange={e => setFormData({ ...formData, 'description': e.target.value})}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Give a brief description..."    />
                    </Form.Group>
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
                                        <option value={category}>{category}</option>
                                    )
                                })
                            }
               
                        </Form.Control>
                    </Form.Group>
                    <p>Upload an Image</p>
                    <ButtonGroup toggle style={{marginBottom: '20px'}}>
                        {radios.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="secondary"
                            name="radio"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                        >
                            {radio.name}
                        </ToggleButton>
                        ))}
                    </ButtonGroup>
                    {radioValue === '1' ?
                        <Form.Group>
                            <Form.File id="photofile" />
                        </Form.Group>
                        :
                        <></>
                    }
                    
                </Form>
                {radioValue === '2' ?
                    <div>
                        <div>
                            <form>
                                <input type="text" placeholder="search" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                                <button onClick={submitHandlerPhotos}>Search Pictures</button>
                            </form>
                        </div>
                        <div className="testImageContainer">
                            {
                                photos ?
                                photos.map((link, index) => {
                                    return(
                                        <div id={index} >
                                            <img alt="test" src={link[1]} onClick={() => photoClickHandler(index, link)} className={index === selected ? "testImageClicked" : "testImage"}/>
                                        </div>
                                    )
                                }) 
                                :
                                <></>
                            }
                        </div>
                    </div>
                        :
                        <></>
                    }
                
                <SubmitButton onClick={handleFormSubmit}>Create Category Item</SubmitButton>
            </div>
            
        </FormContainer>
        
    )

    
}

export default CreateCategoryItem;
