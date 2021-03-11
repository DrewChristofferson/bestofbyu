import React, { useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'
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
import { listCategorys } from '../graphql/queries'
import { API } from 'aws-amplify'



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

    if(categorys[0]){
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
                <div id="main-container">
                    <div>
                        <bs.Button >Create New Category</bs.Button>
                    </div>
                    
                    <div className="categorySection">
                        <h1>Recently Added</h1>
                        <div className="categoryPreview">
                            {
                                categorys.map(category => {
                                    return(
                                        <bs.Card key={category.id} style={{ width: '18rem', color: "black" }} className="categoryItemPreview">
                                        <Link to={`/category/${category.id}`} className="nav-link" style={{color: "black"}}>
                                        
                                        <bs.Card.Img variant="top" src={boardgame} />
                                        <bs.Card.Body>
                                            <bs.Card.Title>{category.name}</bs.Card.Title>
                                            <bs.Card.Text>
                                            {category.description}
                                            </bs.Card.Text>
                                        </bs.Card.Body>
                                        </Link>
                                        </bs.Card>
                                    )
                                })
                            }
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