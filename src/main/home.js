import React, { useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import classroom from '../images/classroom.jpg'
import boardgame from '../images/boardgame.jpg'
import date from '../images/date.jpg'
import hikes from '../images/hikes.jpg'
import movie from '../images/movie.jpg'
import professor from '../images/professor.jpg'
import recipes from '../images/recipes.jpg'
import dog from '../images/dogs.jpg'
import gift from '../images/gift.jpg'
import idea from '../images/idea.png'
import byu from '../images/byu1.jpg'
import * as BsIcons from 'react-icons/bs'
import { listCategorys } from '../graphql/queries'
import { API } from 'aws-amplify'
import CreateCatModal from '../utilities/createcatmodal'
import CreateCategory from './createcategory'



let divStyle={
    backgroundImage: "url(https://images.unsplash.com/photo-1495903546524-cdb71d0aed7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTV8fHVwfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=60)",
    paddingBottom: "8rem",
    backgroundPosition: "center center"
}

const categoryData = [
    {
        id: "classes",
        name: "Classes",
        description: "The top classes in your major or by GE requirement.",
        numRatings: 1480,
        createdBy: "Best of BYU",
        link: "/schools/all/all/courses",
        imgsrc: classroom,
        createdAt: '2021-03-14T',
        items: {
            items: [ 
                {},{},{}
            ]
        }
    },
    {
        id: "professors",
        name: "Professors",
        description: "Top professors by department and class.",
        numRatings: 1158,
        createdBy: "Best of BYU",
        link: "/schools/all/all/professors",
        imgsrc: professor,
        createdAt: '2021-03-14T',
        items: {
            items: [ 
                {},{},{}
            ]
        }
    },

    
]

function Home() {
    const [categorys, setCategorys] = useState({});
    const [isLoadingCategorys, setIsLoadingCategorys] = useState(true);
    const [searchSuggestions, setSearchSuggestions] = useState();
    let history = useHistory();


    useState(() => {
        getData();
    }, [])


    async function getData() {
        let sortedByName; //TODO
        let sortedByRatings;
        const apiData = await API.graphql({ query: listCategorys });
        const categorysFromAPI = apiData.data.listCategorys.items;

        await Promise.all(categorysFromAPI.map(async category => {
          return category;
        }))
        categoryData.forEach(category => ( 
            apiData.data.listCategorys.items.push(category)
        ))

        sortedByRatings = apiData.data.listCategorys.items;
        sortedByRatings.sort((a, b) => (a.numRatings < b.numRatings) ? 1 : (a.numRatings === b.numRatings) ? ((a.name > b.name) ? 1 : -1) : -1 )
        setCategorys(sortedByRatings);
        console.log(apiData.data.listCategorys.items);
        setIsLoadingCategorys(false);
    }

    function handleClick(id) {
        if(id){
            history.push(`category/${id}`);
        }
      }

    let handleSearchChange = (val) => {
        let searchCategorys = [];
        let regex;
        if(val){
            regex = new RegExp(`${val.toUpperCase()}`);

            let i = 0;
            while (searchCategorys.length <= 5){
                if(categorys[i]){
                    if(regex && regex.test(categorys[i].name.toUpperCase())){
                        searchCategorys.push(categorys[i]);
                    }     
                    i++;
                } else break;
                
            }
            if(!searchCategorys[0]){
                searchCategorys = 'noData'
            }
            setSearchSuggestions(searchCategorys);
        } else {
            setSearchSuggestions(null);
        }
        
        
    }

    let returnSearchSuggestions = () => {
        if(searchSuggestions){
            if(searchSuggestions === 'noData'){
                return(
                    <div>
                        <p>No categories found</p>
                    </div> 
                )
            }
            else{
                return(
                    searchSuggestions.map(category => ( 
                        <div key={category.id} onClick={() => handleClick(category.id)}>
                            <p>{category.name}</p>
                        </div>   
                    ))
                );
            } 
        } else return null;
    }

    let submitHandler = (e) => {
        e.preventDefault();
    }


    if(categorys[0]){
        return(
            <>
            <div className="py-0">
                <bs.Jumbotron fluid style={divStyle} >
                    <bs.Container style={{my: "5rem"}} className="py-0">
                        <h1 className="title">Best of BYU</h1>
                        <h4 className="subtitle">
                            Crowd-sourced Ratings by Category
                        </h4>
                        <bs.Form onSubmit={submitHandler}>
                            <bs.Row style={{marginTop: "2rem"}} className="justify-content-md-center">
                                <bs.Col md="6">
                                    <bs.InputGroup>
                                        <bs.Form.Control style={{position: "relative"}} onChange={(e) => handleSearchChange(e.currentTarget.value)} placeholder="Search classes, games, recipes, and more..." />
                                        <bs.InputGroup.Append onClick={() => handleClick(searchSuggestions ? searchSuggestions[0].id : null)}>
                                            <bs.InputGroup.Text id="basic-addon2" style={{backgroundColor: "#2077B0", border: "none"}}><BsIcons.BsSearch style={{color: "white", cursor: "pointer"}}/></bs.InputGroup.Text>
                                        </bs.InputGroup.Append>
                                    </bs.InputGroup>
                                
                                </bs.Col>
                            </bs.Row>
                        </bs.Form>
                        <div className="searchDropdown">
                            {returnSearchSuggestions()}
                        </div>
                        {/* !hardcoded! */}
                        <p className="trending">
                            Now Trending: 
                            <span className="trending-item" onClick={() => handleClick(categorys[0].id)}> {categorys[0].name}</span>
                            , <span className="trending-item" onClick={() => handleClick(categorys[1].id)}> {categorys[1].name}</span>
                            , <span className="trending-item" onClick={() => handleClick(categorys[2].id)}> {categorys[2].name}</span>
                        </p>
                        
                    </bs.Container>
                </bs.Jumbotron>
                <div id="main-container">
                    
                    
                    <div className="categorySection">
                        <h1>Recently Added</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    if(category.createdAt.split('T')[0] === '2021-04-07'){
                                        return(
                                            <div key={category.id}>
                                            
                                                {/* <div className="catPreviewImg">
                                                    
                                                </div>
                                                <div className="catPreviewTitle">
                                                    {category.name}
                                                </div>
                                                <div className="catPreviewSubtitle">
                                                    {category.description}
                                                </div> */}
                                                <bs.Card key={category.id} style={{ width: '12rem', color: "black" }} className="categoryItemPreview">
                                                <Link to={`/category/${category.id}`} className="nav-link" style={{color: "black"}}>
                                                <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                        {`${category.numRatings} Ratings | ${category.items.items.length} Items`}

                                                    </bs.Card.Text>
                                                <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                <bs.Card.Body style={{padding: '20px 5px'}}>
                                                    <bs.Card.Title>{category.name}</bs.Card.Title>
                                                    
                                                    <bs.Card.Text style={{fontSize: '12px', fontWeight: '600', marginBottom: '.3rem'}}>
                                          
                                                        {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                   
                                                    </bs.Card.Text>
                                                    <bs.Card.Text style={{fontSize: '14px', marginBottom: 0}}>
                                        
                                                        {category.description}
                                                    </bs.Card.Text>
                                                </bs.Card.Body>
                                                </Link>
                                                </bs.Card>
                                            </div>
                                        )
                                    } else return <></>
                                    
                                })
                            }
                        </div> 
                    </div>
                    <div className="categorySection">
                        <h1>Popular</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    if(category.numRatings >= 5){
                                        return(
                                            <div key={category.id}>
                                            
                                                {/* <div className="catPreviewImg">
                                                    
                                                </div>
                                                <div className="catPreviewTitle">
                                                    {category.name}
                                                </div>
                                                <div className="catPreviewSubtitle">
                                                    {category.description}
                                                </div> */}
                                                <bs.Card key={category.id} style={{ width: '12rem', color: "black" }} className="categoryItemPreview">
                                                <Link to={category.link ? category.link : `/category/${category.id}`} className="nav-link" style={{color: "black"}}>
                                                <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                        {`${category.numRatings} Ratings | ${category.items.items.length} Items`}
                                                      
                                                    </bs.Card.Text>
                                                <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                <bs.Card.Body style={{padding: '20px 5px'}}>
                                                    <bs.Card.Title>{category.name}</bs.Card.Title>
                                                    
                                                    <bs.Card.Text style={{fontSize: '12px', fontWeight: '600', marginBottom: '.3rem'}}>
                                          
                                                        {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                   
                                                    </bs.Card.Text>
                                                    <bs.Card.Text style={{fontSize: '14px', marginBottom: 0}}>
                                        
                                                        {category.description}
                                                    </bs.Card.Text>
                                                </bs.Card.Body>
                                                </Link>
                                                </bs.Card>
                                            </div>
                                        )
                                    } else return <></>
                                    
                                })
                            }
                        </div> 
                    </div>

                    <div className="banner">
                        <div className="bannerTitle">
                            Start a New Category
                        </div>
                        <div className="bannerSubtitle">
                            In less than a minute you can set up a new ratings board for anything from TV Shows on Netflix to Protein Powder.
                        </div>
                        <div className="bannerCTA">
                            <bs.Button onClick={() => history.push("/create/category")}>Create New Category</bs.Button>
                            {/* <CreateCatModal getCategorys={getData}/> */}
                        </div>
                    </div>

                    <div className="categorySection">
                        <h1>All Categories</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    // if(category.numRatings <= 5){
                                        return(
                                            <div key={category.id}>
                                            
                                                {/* <div className="catPreviewImg">
                                                    
                                                </div>
                                                <div className="catPreviewTitle">
                                                    {category.name}
                                                </div>
                                                <div className="catPreviewSubtitle">
                                                    {category.description}
                                                </div> */}
                                                <bs.Card key={category.id} style={{ width: '12rem', color: "black" }} className="categoryItemPreview">
                                                <Link to={category.link ? category.link : `/category/${category.id}`} className="nav-link" style={{color: "black"}}>
                                                <bs.Card.Text style={{fontSize: '14px', marginBottom: '.3rem', textAlign: 'center'}}>
                                                        {`${category.numRatings} Ratings | ${category.items.items.length} Items`}
                                                      
                                                    </bs.Card.Text>
                                                <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                                <bs.Card.Body style={{padding: '20px 5px'}}>
                                                    <bs.Card.Title>{category.name}</bs.Card.Title>
                                                    
                                                    <bs.Card.Text style={{fontSize: '12px', fontWeight: '600', marginBottom: '.3rem'}}>
                                          
                                                        {`Created By: ${category.createdBy ? category.createdBy : 'Private User'}`}
                                                   
                                                    </bs.Card.Text>
                                                    <bs.Card.Text style={{fontSize: '14px', marginBottom: 0}}>
                                        
                                                        {category.description}
                                                    </bs.Card.Text>
                                                </bs.Card.Body>
                                                </Link>
                                                </bs.Card>
                                            </div>
                                        )
                                    // } else return <></>
                                    
                                })
                            }
                        </div> 
                    </div>
                                
                </div>
            </div>
            
            </>
        )
    }
    else{
        return(
            <div className="py-0">
                <bs.Jumbotron fluid style={divStyle} >
                    <bs.Container style={{my: "5rem"}} className="py-0">
                        <h1 className="title">Best of BYU</h1>
                        <bs.Form>
                            <bs.Row style={{marginTop: "2rem"}} className="justify-content-md-center">
                                <bs.Col md="6">
                                <bs.Form.Control placeholder="Search classes, games, recipes, and more..." />
                                </bs.Col>
                            </bs.Row>
                        </bs.Form>
                        <h4 className="subtitle">
                        Post. Vote. Browse.
                        </h4>
                    </bs.Container>
                </bs.Jumbotron>
                <div>
                    Loading Data
                </div>
                            
            </div>
            
            
        )
    }
    
}

export default Home