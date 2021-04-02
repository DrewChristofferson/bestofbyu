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
    backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/c/cf/BYU_Campus_North.jpg)",
    paddingBottom: "8rem"
}

const categoryData = [
    {
        name: "Popular",
        items: [
            {
                id: "akhsgfaksdhf",
                name: "Classes",
                description: "The top classes in your major or by GE requirement.",
                ratings: 1480,
                createdBy: "Best of BYU",
                link: "/schools/all/all/courses",
                imgsrc: classroom
            },
            {
                id: "dnfgnfg",
                name: "Professors",
                description: "Top professors by department and class.",
                ratings: 1158,
                createdBy: "Best of BYU",
                link: "/schools/all/all/professors",
                imgsrc: professor
            },
            {
                id: "zdzxbdf",
                name: "Date Ideas",
                description: "Find the perfect date ranging from casual to romantic.",
                ratings: 366,
                createdBy: "Best of BYU",
                link: "/schools/all/all/courses",
                imgsrc: date
            },
        ]
    },
    {
        name: "All Categories",
        items: [
            {
                id: "bvertsdfg",
                name: "Business Ideas",
                description: "Validate your business ideas with the community.",
                ratings: 96,
                createdBy: "Best of BYU",
                link: "/schools/all/all/courses",
                imgsrc: idea
            },
            {
                id: "bvsgshmhgmfgg",
                name: "Movies",
                description: "The top movies for each streaming service.",
                ratings: 85,
                createdBy: "Best of BYU",
                link: "/schools/all/all/courses",
                imgsrc: movie
            },
        ]
    }

    
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
        const apiData = await API.graphql({ query: listCategorys });
        const categorysFromAPI = apiData.data.listCategorys.items;

        await Promise.all(categorysFromAPI.map(async category => {
          return category;
        }))

        setCategorys(apiData.data.listCategorys.items);
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
            setSearchSuggestions(searchCategorys);
        } else {
            setSearchSuggestions();
        }
        
        
    }

    let returnSearchSuggestions = () => {
        if(searchSuggestions){
            return(
                searchSuggestions.map(category => ( 
                    <div key={category.id} onClick={() => handleClick(category.id)}>
                        <p>{category.name}</p>
                    </div>   
                ))
            );
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
                                            <bs.Card key={category.id} style={{ width: '18rem', color: "black" }} className="categoryItemPreview">
                                            <Link to={`/category/${category.id}`} className="nav-link" style={{color: "black"}}>
                                            
                                            <bs.Card.Img variant="top" alt="img" src={category.imgsrc ? category.imgsrc : boardgame} />
                                            <bs.Card.Body>
                                                <bs.Card.Title>{category.name}</bs.Card.Title>
                                                <bs.Card.Text>
                                                {category.description}
                                                </bs.Card.Text>
                                            </bs.Card.Body>
                                            </Link>
                                            </bs.Card>
                                        </div>
                                    )
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
                    
                    
                    
                    
                    
                    <div>
                        {
                            categoryData.map(category => {
                                return(
                                    <div key={category.name} className="categorySection">
                                        <h1>{category.name}</h1>
                                        <div className="categoryPreview">
        
                                            {
                                                category.items.map(item => {
                                                    return(
                                                        <bs.Card key={item.id} style={{ width: '18rem', color: "black" }} className="categoryItemPreview">
                                                        <Link to={item.link} className="nav-link" style={{color: "black"}}>
                                                        
                                                        <bs.Card.Img variant="top" src={item.imgsrc} />
                                                        <bs.Card.Body>
                                                            <bs.Card.Title>{item.name}</bs.Card.Title>
                                                            <bs.Card.Text>
                                                            {item.description}
                                                            </bs.Card.Text>
                                                        </bs.Card.Body>
                                                        </Link>
                                                        </bs.Card>
                                                    )
                                                }
                                                    
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
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
                    {
                        categoryData.map(category => {
                            return(
                                <div key={category.name} className="categorySection">
                                    <h1>{category.name}</h1>
                                    <div className="categoryPreview">
    
                                        {
                                            category.items.map(item => {
                                                return(
                                                    <bs.Card key={item.id} style={{ width: '18rem', color: "black" }} className="categoryItemPreview">
                                                    <Link to={item.link} className="nav-link" style={{color: "black"}}>
                                                    
                                                    <bs.Card.Img variant="top" src={item.imgsrc} />
                                                    <bs.Card.Body>
                                                        <bs.Card.Title>{item.name}</bs.Card.Title>
                                                        <bs.Card.Text>
                                                        {item.description}
                                                        </bs.Card.Text>
                                                    </bs.Card.Body>
                                                    </Link>
                                                    </bs.Card>
                                                )
                                            }
                                                
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                            
            </div>
            
            
        )
    }
    
}

export default Home