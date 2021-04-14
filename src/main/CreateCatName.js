import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { createApi } from 'unsplash-js';
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listSchools } from '../graphql/queries';
import { createCategory as createCategoryMutation } from '../graphql/mutations';

const initialFormState = { name: '', description: '', imgsrc: '', numRatings: '0', subCategoryOptions: [], customFields: []}

const Container = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
`

const PreviewContainer = styled.div`
    flex-basis: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const PreviewTitle = styled.h1`

` 
const PreviewDescription = styled.h4`

` 

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
`

const PreviewImage = styled.img`
    width: 30%;
` 

const UserInputContainer = styled.div`
    flex-basis: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const StyledForm = styled(Form)`
    width: 50%;
    text-align: left;
`

const ButtonsContainer = styled.div`
    width: 50%;
    display: flex;
    justify-content: space-between;
`
const ButtonRight = styled.div`
    width: 50%;
    display: flex;
    justify-content: flex-end;
`

function CreateCatName() {
    const unsplashAccessKey = 'Vi_vrZ3sI2PbvoBYAnrYfDEbqTSa75R7_zcO0lHR7z8';
    const [photos, setPhotos] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoryInputs, setSubCategoryInputs] = useState(['input-0']);
    const [customFieldInputs, setCustomFieldInputs] = useState(['inputCustom-0']);
    const [customFields, setCustomFields] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selected, setSelected] = useState();
    const [formData, setFormData] = useState(initialFormState);
    const history = useHistory();
    let match = useRouteMatch();
    const unsplash = createApi({
        accessKey: unsplashAccessKey,
        // `fetch` options to be sent with every request
        // headers: { 'X-Custom-Header': 'foo' },
      });
    
    useEffect(() => {
        console.log(formData)
    })
    async function createCategory() {
        if (!formData.name || !formData.description) return;
        let response = await API.graphql({ query: createCategoryMutation, variables: { input: formData } });
        console.log(response);
        if (formData.image) {
          const image = await Storage.get(formData.image);
          formData.image = image;
        }
        // props.getCategorys();
        setFormData(initialFormState);
        history.push(`/category/${response.data.createCategory.id}`)
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
        createCategory();
    }

    let handleSubCategoryChange = (inputRow, text) => {
        let tempArr = [];
        if (subCategories.length) {
            for (let i = 0; i < subCategories.length + 1; i++) {
                if(inputRow === `input-${i}`){
                    tempArr[i] = text;
                } else{
                    if (i < subCategories.length){
                        tempArr.push(subCategories[i]);
                    }
                }
            }
        } else {
            tempArr.push(text);
        }
        

        setSubCategories(tempArr);
        setFormData({ ...formData, 'subCategoryOptions': tempArr})
    }

    let handleCustomFieldChange = (inputRow, text) => {
        let tempArr = [];
        if (customFields.length) {
            for (let i = 0; i < customFields.length + 1; i++) {
                if(inputRow === `inputCustom-${i}`){
                    tempArr[i] = text;
                } else{
                    if (i < customFields.length){
                        tempArr.push(customFields[i]);
                    }
                }
            }
        } else {
            tempArr.push(text);
        }
        

        setCustomFields(tempArr);
        setFormData({ ...formData, 'customFields': tempArr})
    }

    let photoClickHandler = (id, link) => {
        console.log(`photo ${id} clicked`);
        if (id === selected){
            setSelected(null);
            setFormData({ ...formData, 'imgsrc': ''})
        } else {
            setSelected([id, link[1]]);
            setFormData({ ...formData, 'imgsrc': link[1]})
        }
        console.log(formData)
    }

    let addInputRow = (type) => {
        if (type === 'custom-fields'){
            setCustomFieldInputs([...customFieldInputs, `inputCustom-${customFieldInputs.length}`])
        } else if (type === 'subcategories') {
            setSubCategoryInputs([...subCategoryInputs, `input-${subCategoryInputs.length}`])
        }
    }
    

    // if(photos[0]){
    //     photos.map(link => {
    //         return(
    //             <img alt="test" src={link} />
    //         )
    //     })  
    // }
    return (
        <Container>
            <PreviewContainer>
                <ImageContainer>
                    {
                        selected ?
                        <PreviewImage alt="your image" src={selected[1]} />
                        :
                        <></>
                    }
                </ImageContainer>
                
                <PreviewTitle>{formData.name}</PreviewTitle>
                <PreviewDescription>{formData.description}</PreviewDescription>
                <PreviewDescription>
                    Your Subcategories are:
                    {
                        formData.subCategoryOptions.map((subcat, index) => {
                            return(
                                <p>{subcat}</p>
                            )
                        })
                    }
                </PreviewDescription>
                <PreviewDescription>
                    Your Custom Fields are:
                    {
                        formData.customFields.map((field, index) => {
                            return(
                                <p>{field}</p>
                            )
                        })
                    }
                </PreviewDescription>
            </PreviewContainer>
            <UserInputContainer>
            <Switch>
                
                <Route path={`${match.url}/description`}>
                    <StyledForm onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlTextarea1" >
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.description} placeholder="Give a brief description..."  onChange={e => setFormData({ ...formData, 'description': e.target.value})}  />
                        </Form.Group>
                    </StyledForm>
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => history.push(`${match.url}`)}>Back</Button>
                        <Button onClick={() => history.push(`${match.url}/subcategory`)}>Next</Button>
                    </ButtonsContainer>
                    
                </Route>
                <Route path={`${match.url}/subcategory`}>
                    <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label>Subcategories (enter in comma-separated list)</Form.Label>
                        {
                            subCategoryInputs.map((input, index) => {
                                return(
                                    <Form.Control type="text" key={input} value={subCategories[index]} onChange={(e) => handleSubCategoryChange(input, e.target.value)}/>
                                )    
                            })
                        }
                        <ButtonRight>
                            <Button onClick={() => addInputRow('subcategories')}>+</Button>
                        </ButtonRight>
                        
                    </Form.Group>
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => history.push(`${match.url}/description`)}>Back</Button>
                        <Button onClick={() => history.push(`${match.url}/custom-fields`)}>Next</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={`${match.url}/custom-fields`}>
                    <Form.Group controlId="exampleForm.ControlInput3">
                        <Form.Label>Custom Fields</Form.Label>
                        {
                            customFieldInputs.map((input, index) => {
                                return(
                                    <Form.Control type="text" key={input} value={customFields[index]} onChange={(e) => handleCustomFieldChange(input, e.target.value)}/>
                                )    
                            })
                        }
                        <ButtonRight>
                            <Button onClick={() => addInputRow('custom-fields')}>+</Button>
                        </ButtonRight>
                        
                    </Form.Group>
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => history.push(`${match.url}/subcategory`)}>Back</Button>
                        <Button onClick={() => history.push(`${match.url}/image`)}>Next</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={`${match.url}/image`}>
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
                                        <img alt="test" src={link[1]} onClick={() => photoClickHandler(index, link)} className={selected && index === selected[0] ? "testImageClicked" : "testImage"}/>
                                    </div>
                                )
                            }) 
                            :
                            <></>
                        }
                    </div>
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => history.push(`${match.url}/custom-fields`)}>Back</Button>
                        <Button onClick={createCategory}>Create Category</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={match.url}>
                    <StyledForm onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlInput1" >
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control type="text" placeholder="Gift Ideas" value={formData.name} onChange={e => setFormData({ ...formData, 'name': e.target.value})}/>
                        </Form.Group>
                    </StyledForm>
                    <ButtonRight>
                        <Button onClick={() => history.push(`${match.url}/description`)}>Next</Button>
                    </ButtonRight>
                    
                </Route>

            </Switch>
                
            </UserInputContainer>
        </Container>
        
    )

    
}

export default CreateCatName;
