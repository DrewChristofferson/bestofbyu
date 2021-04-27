import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import { createApi } from 'unsplash-js';
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import Button from "react-bootstrap/Button"
import ProgressBar from "react-bootstrap/ProgressBar"
import Form from "react-bootstrap/Form"
import { API } from 'aws-amplify'
import { listCategorys } from '../../graphql/queries'
import { createCategory as createCategoryMutation } from '../../graphql/mutations';
import AppContext from '../../context/context'

const initialFormState = { id: '', name: '', description: '', imgsrc: '', numRatings: '0', subCategoryOptions: [], customFields: [], createdBy: ''}

const Container = styled.div`
    display: flex;
    margin-top: 72px;
    width: 100%;
`
const PreviewHeader = styled.div`
    margin: 0 30px 30px;
    background: radial-gradient(#2f5cfc, #5075fc);
    border-radius: 5px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Lobster', cursive;
    color: white;
`
const TitleContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    
`
const PreviewTitleWords = styled.div`
    display: flex;
    flex-direction: column;
`
const ProgressContainer = styled.div`
    display: flex;
    justify-content: center;
`
const StyledProgress = styled(ProgressBar)`
    width: 50%;
    margin: 100px 0 30px 0;
`

const PreviewContainer = styled.div`
    flex-basis: 40%;
    display: flex;
    margin: 0 30px;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
`
const PreviewDetails = styled.div`
    margin-left: 50px;
`

const PreviewTitle = styled.h1`
    color: black;
    
` 
const PreviewTitlePlaceholder = styled.h1`
    color: gray;
    
` 
const PreviewDescription = styled.h4`

` 

const ImageContainer = styled.div`
    margin: 0;
    margin-right: 30px;
`


const PreviewImage = styled.img`
    width: 100%;
    border-radius: 10px;
    
` 

const UserInputContainer = styled.div`
    flex-basis: 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: 10%;
`
const Instructions = styled.div`
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
`
const InstructionsTitle = styled.h3`
    padding-bottom: 15px;
`
const InstructionsSubTitle = styled.h6`

`
const InstructionsExplanation = styled.p`
    color: gray;
`

const StyledForm = styled(Form)`
    width: 50%;
    text-align: left;
`
const PositionedFromField = styled(Form.Control)`
    flex-basis: 70%
`
const InputWrapper = styled.div`
    display: flex;
    margin-bottom: 10px;
`
const SearchForm = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    margin-bottom: 10px;
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
const AddRowButton = styled.div`
    flex-basis: 30%;
    display: flex;
    justify-content: flex-start;
    margin-left: 10px;
`

const progressValues = {
    name: 15,
    description: 35,
    subcategories: 50,
    customFields: 70,
    image: 90,
    done: 100
}

function CreateCatName() {
    const unsplashAccessKey = 'Vi_vrZ3sI2PbvoBYAnrYfDEbqTSa75R7_zcO0lHR7z8';
    const [photos, setPhotos] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categorys, setCategorys] = useState({});
    const [progressValue, setProgressValue] = useState(0);
    const [subCategoryInputs, setSubCategoryInputs] = useState(['input-0']);
    const [customFieldInputs, setCustomFieldInputs] = useState(['inputCustom-0']);
    const [customFields, setCustomFields] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selected, setSelected] = useState();
    const [formData, setFormData] = useState(initialFormState);
    const [isNameError, setIsNameError] = useState(false);
    const [isInvalidCategory, setIsInvalidCategory] = useState(false);
    const context = useContext(AppContext)
    const history = useHistory();
    let match = useRouteMatch();
    let matchParams = useRouteMatch("/create-category/:page");
    const unsplash = createApi({
        accessKey: unsplashAccessKey,
        // `fetch` options to be sent with every request
        // headers: { 'X-Custom-Header': 'foo' },
      });
    
    useEffect(() => {
        console.log(formData)
    })

    useEffect(() => {
        getCategorys();
        console.log(context)
        setFormData({ ...formData, 'createdBy': context?.user?.attributes?.email});

        switch(matchParams?.params?.page) {
            case 'description':
                setProgressValue(progressValues.description);
                break;
            case 'subcategory':
                setProgressValue(progressValues.subcategories);
                break;
            case 'custom-fields':
                setProgressValue(progressValues.customFields);
                break;
            case 'image':
                setProgressValue(progressValues.image);
                break;
            default:
                setProgressValue(progressValues.name);
        }
    }, [])

    async function getCategorys() {

        const apiData = await API.graphql({ query: listCategorys });
        const categorysFromAPI = apiData.data.listCategorys.items;

        await Promise.all(categorysFromAPI.map(async category => {
          return category;
        }))
        setCategorys(apiData.data.listCategorys.items);
    }

    async function createCategory() {
        if (!formData.name || !formData.description) {
            setIsInvalidCategory(true);
            return;
        };
        let response = await API.graphql({ query: createCategoryMutation, variables: { input: formData } });
        console.log(response);
        if (formData.image) {
          const image = await Storage.get(formData.image);
          formData.image = image;
        }
        setFormData(initialFormState);
        progressFull();
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
        setSearchFilter(val);
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

    let handleSubCategoryChange = (inputRow, e) => {
        let tempArr = [];
        if (subCategories.length) {
            for (let i = 0; i < subCategories.length + 1; i++) {
                if(inputRow === `input-${i}`){
                    tempArr[i] = e.target.value;
                } else{
                    if (i < subCategories.length){
                        tempArr.push(subCategories[i]);
                    }
                }
            }
        } else {
            tempArr.push(e.target.value);
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
        if (selected && id === selected[0]){
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

    let navigateNext = (link) => {
        let tempValue = 0;
        if (matchParams?.params?.page) {
            switch(matchParams.params.page) {
                case 'description':
                    tempValue = progressValues.subcategories;
                    break;
                case 'subcategory':
                    tempValue = progressValues.customFields;
                    break;
                case 'custom-fields':
                    tempValue = progressValues.image;
                    break;
                default:
                    tempValue = 0;
            }
        } else {
            tempValue = progressValues.description;
        }
        
        history.push(link);
        setProgressValue(tempValue)
    }

    let navigateBack = (link) => {
        let tempValue = 0;
        if (matchParams?.params?.page) {
            switch(matchParams.params.page) {
                case 'description':
                    tempValue = progressValues.name;
                    break;
                case 'subcategory':
                    tempValue = progressValues.description;
                    break;
                case 'custom-fields':
                    tempValue = progressValues.subcategories;
                    break;
                case 'image':
                    tempValue = progressValues.customFields;
                    break;
                default:
                    tempValue = 0;
            }
        } else {
            tempValue = progressValues.name;
        }
        
        history.push(link);
        setProgressValue(tempValue);
    }

    const progressFull = () => {
        setProgressValue(progressValues.done);
    }

    const handleNameChange = (value) => {
        // setFormData({ ...formData, 'id': value.replaceAll(' ','-').toLowerCase()});
        setFormData({ ...formData, 'name': value});
        if(isNameError){
            setIsNameError(false);
        }
    }

    const validateName = () => {
        let isValid = true;
        let newID = formData.name.replaceAll(' ','-').toLowerCase()
        setFormData({ ...formData, 'id': newID});
        for (const cat of categorys) {
            if(newID === cat.id){
                setIsNameError(true);
                isValid = false;
            }
        } 
        if(isValid){
            navigateNext(`${match.url}/description`)
        }   
    }

    return (
        <>
        <Container> 
            <PreviewContainer>
                <PreviewHeader><h1>Your Category Preview</h1></PreviewHeader>
                <PreviewDetails>
                    <TitleContainer>
                        {
                            selected ?
                            <ImageContainer>
                                <PreviewImage alt="your image" src={selected[1]} />
                            </ImageContainer>
                            :
                            <></>
                        }
                        <PreviewTitleWords>
                            {
                                formData.name.length ?
                                <div>
                                    <PreviewTitle>{formData.name}</PreviewTitle>
                                    <h4>Items: 0</h4>
                                </div>
                                
                                :
                                <PreviewTitlePlaceholder>My Category</PreviewTitlePlaceholder>
                            }   
                        </PreviewTitleWords>
                    </TitleContainer>
                    <PreviewDescription>{formData.description}</PreviewDescription>
                    <div>
                        {
                            <div>
                                Each item will have the following fields:
                                <ul>
                                <li>Score</li>
                                <li>Creator Name</li>
                                <li>Created Date</li>
                                {
                                    formData.customFields[0] ?
                                    formData.customFields.map((field, index) => {
                                        return(
                                            field.length ?
                                            <li key={index}>{field}</li>
                                            :
                                            <></>
                                        )
                                    })
                                    :
                                    <></>
                                }
                                </ul> 
                            </div>
                        }
                    </div>
                    <div> 
                        {
                            formData.subCategoryOptions[0] ?
                            <div>
                                Each item will have ONE of the following subcategories:
                                <ul>
                                {
                                    formData.subCategoryOptions.map((subcat, index) => {
                                        return(
                                            <li key={index}>{subcat}</li>
                                        )
                                    })
                                }
                                </ul>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </PreviewDetails>
            </PreviewContainer>
            <UserInputContainer>
            <Switch>
                <Route path={`${match.url}/description`}>
                        <Instructions>
                            <InstructionsTitle>Add Description</InstructionsTitle>
                            <InstructionsSubTitle>
                                A description tells other people what your category is about.
                            </InstructionsSubTitle>
                            <InstructionsExplanation>
                                For example: Great meals that you can make in under 1 hour.
                            </InstructionsExplanation>
                        </Instructions>
                    <StyledForm onSubmit={submitHandler}> 
                        <Form.Group controlId="exampleForm.ControlTextarea1" >
                            {/* <Form.Label>Description</Form.Label> */}
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={formData.description}   
                                onChange={e => setFormData({ ...formData, 'description': e.target.value})}  
                            />
                        </Form.Group>
                    </StyledForm>
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => navigateBack(`${match.url}`)}>Back</Button>
                        <Button onClick={() => navigateNext(`${match.url}/subcategory`)}>Next</Button>
                    </ButtonsContainer> 
                </Route>
                <Route path={`${match.url}/subcategory`}>
                    <Instructions>
                        <InstructionsTitle>Add Subcategories</InstructionsTitle>
                        <InstructionsSubTitle>
                            Subcategories help users sort items in your category. 
                            Each item in your category should fit into one subcategory. 
                        </InstructionsSubTitle>
                        <InstructionsExplanation>
                            For example,
                            Breakfast, Lunch, Dinner, and Other subcategories for recipes.
                        </InstructionsExplanation>
                    </Instructions>
                    
                        {/* <Form.Label>Subcategories (enter in comma-separated list)</Form.Label> */}
                        {
                            subCategoryInputs.map((input, index) => {
                                
                                return(
                                    <Form.Group controlId={`subcat${index}`} style={{width: '80%'}}>
                                        {
                                            subCategoryInputs.length - 1 === index ?
                                            <InputWrapper key={index}>
                                                <PositionedFromField 
                                                    type="text" 
                                                    key={input} 
                                                    value={subCategories[index]} 
                                                    onKeyDown={event => event.key === 'Enter' ? addInputRow('subcategories') : null} 
                                                    onChange={(e) => handleSubCategoryChange(input, e)}
                                                />
                                                <AddRowButton>
                                                    <Button onClick={() => addInputRow('subcategories')}>+</Button>
                                                </AddRowButton>
                                            </InputWrapper>
                                 
                                            :
                                            <InputWrapper>
                                                <PositionedFromField 
                                                    type="text" 
                                                    key={input} 
                                                    value={subCategories[index]} 
                                                    onKeyDown={event => event.key === 'Enter' ? addInputRow('subcategories') : null} 
                                                    onChange={(e) => handleSubCategoryChange(input, e)}
                                                />
                                            </InputWrapper>
                                           }
                                    
                                           </Form.Group>
                                )    
                            })
                        } 
                    
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => navigateBack(`${match.url}/description`)}>Back</Button>
                        <Button onClick={() => navigateNext(`${match.url}/custom-fields`)}>Next</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={`${match.url}/custom-fields`}>
                        <Instructions>
                            <InstructionsTitle>Add Custom Properties</InstructionsTitle>
                            <InstructionsSubTitle>
                                Custom properties let people attach unique details to each item in your category.
                            </InstructionsSubTitle>
                            <InstructionsExplanation>
                                For example,
                                cost and preparation time would be custom properties for a recipes category.
                            </InstructionsExplanation>
                        </Instructions>
                        {/* <Form.Label>Custom Fields</Form.Label> */}
                        {
                            customFieldInputs.map((input, index) => {
                                return(
                                    <Form.Group controlId={`custom${index}`} style={{width: '80%'}}>
                                    {
                                        customFieldInputs.length - 1 === index ?
                                        <InputWrapper key={index}>
                                            <PositionedFromField 
                                            type="text" 
                                            key={input} 
                                            lue={customFields[index]} 
                                            onKeyDown={event => event.key === 'Enter' ? addInputRow('custom-fields') : null} 
                                            onChange={(e) => handleCustomFieldChange(input, e.target.value)}/>
                                            <AddRowButton>
                                                <Button onClick={() => addInputRow('custom-fields')}>+</Button>
                                            </AddRowButton>
                                        </InputWrapper>
                                        :
                                        <InputWrapper>
                                            <PositionedFromField 
                                                type="text" 
                                                key={input} 
                                                value={customFields[index]} 
                                                onKeyDown={event => event.key === 'Enter' ? addInputRow('custom-fields') : null} 
                                                onChange={(e) => handleCustomFieldChange(input, e.target.value)}/>
                                            <div></div>
                                        </InputWrapper>
                                    }
                                    
                                    </Form.Group>
                                )   
                            })
                        }  
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => navigateBack(`${match.url}/subcategory`)}>Back</Button>
                        <Button onClick={() => navigateNext(`${match.url}/image`)}>Next</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={`${match.url}/image`}>
                    <Instructions>
                        <InstructionsTitle>Add Photos</InstructionsTitle>
                        <InstructionsSubTitle>
                            Search for a cover photo from the Unsplash photo library.
                        </InstructionsSubTitle>
                    </Instructions>
                    <SearchForm>
                        <form>
                            <input type="text" placeholder="search" onChange={(e) => handleChangeSearch(e.currentTarget.value)}/>
                            <button onClick={submitHandlerPhotos}>Search Pictures</button>
                        </form>
                    </SearchForm>
                    <div className="testImageContainer">
                        {
                            photos[0] ?
                            photos.map((link, index) => {
                                return(
                                    <div id={index} key={index}>
                                        <img alt="test" src={link[1]} onClick={() => photoClickHandler(index, link)} className={selected && index === selected[0] ? "testImageClicked" : "testImage"}/>
                                    </div>
                                )
                            }) 
                            :
                            <div>No photos found</div>
                        }
                    </div>
                    {
                        isInvalidCategory ?
                        <p style={{color: 'red'}}>Your category must have a name and description</p>
                        :
                        <></>
                    }
                    <ButtonsContainer>
                        <Button variant="secondary" onClick={() => navigateBack(`${match.url}/custom-fields`)}>Back</Button>
                        <Button onClick={createCategory}>Create Category</Button>
                    </ButtonsContainer>
                </Route>
                <Route path={match.url}>
                        <Instructions>
                            <InstructionsTitle>Add Category Name</InstructionsTitle>
                            <InstructionsSubTitle>
                                A category is a topic that people will be able to post individual items in.
                            </InstructionsSubTitle>
                            <InstructionsExplanation>
                                For example: A Recipes category will have individual recipe items.
                            </InstructionsExplanation>
                        </Instructions>
                    <StyledForm onSubmit={submitHandler}>
                        <Form.Group controlId="exampleForm.ControlInput1" >
                            {/* <Form.Label>Category Name</Form.Label> */}
                            <Form.Control type="text"  value={formData.name} onChange={(e) => handleNameChange(e.currentTarget.value)}/>
                            {
                                isNameError ?
                                <p style={{color: 'red'}}>The category {formData.name} already exists.</p>
                                :
                                <></>
                            }
                        </Form.Group>
                    </StyledForm>
                    <ButtonRight>
                        <Button onClick={validateName}>Next</Button>
                    </ButtonRight> 
                </Route>
            </Switch>
            <StyledProgress now={progressValue} />
            </UserInputContainer>
        </Container>
        {/* <ProgressContainer>
            <StyledProgress now={progressValue} />
        </ProgressContainer> */}
        </> 
    ) 
}

export default CreateCatName;
