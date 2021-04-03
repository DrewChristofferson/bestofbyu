import React, {useEffect, useState} from 'react'
import { createApi } from 'unsplash-js';
import { useHistory } from 'react-router-dom'
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { createCategoryItem as createCategoryItemMutation } from '../graphql/mutations';

const initialFormState = { categoryID: '', name: '', description: '', imgsrc: '', content: '', score: '0'}

function CreateCategoryItem(props) {
    const unsplashAccessKey = 'Vi_vrZ3sI2PbvoBYAnrYfDEbqTSa75R7_zcO0lHR7z8';
    const [photos, setPhotos] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selected, setSelected] = useState();
    const [formData, setFormData] = useState(initialFormState);
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
        // history.push(`/category/${response.data.createCategory.id}`)
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
        <div>
            <div style={{width: '50%'}}>
                Create New
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="exampleForm.ControlInput1" onChange={e => setFormData({ ...formData, 'name': e.target.value})}>
                        <Form.Label>Item Name</Form.Label>
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
                <Button onClick={handleFormSubmit}>Create Category</Button>
            </div>
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
        
    )

    
}

export default CreateCategoryItem;
