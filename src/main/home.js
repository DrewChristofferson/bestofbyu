import React from 'react'
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import classroom from '../images/classroom.jpg'
import boardgame from '../images/boardgame.jpg'
import date from '../images/date.jpg'
import movie from '../images/movie.jpg'
import professor from '../images/professor.jpg'
import recipes from '../images/recipes.jpg'
import byu from '../images/byu1.jpg'


let divStyle={
    backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/c/cf/BYU_Campus_North.jpg)",
    paddingBottom: "8rem"
}

function Home() {
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
            <bs.Container>
                <bs.Row>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem', color: "black" }}>
                        <Link to="/schools/all/all/courses" className="nav-link" style={{color: "black"}}>
                        
                        <bs.Card.Img variant="top" src={classroom} />
                        <bs.Card.Body>
                            <bs.Card.Title>Classes</bs.Card.Title>
                            <bs.Card.Text>
                            The top classes in your major or by GE requirement.
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem' }}>
                        <Link to="/schools/all/all/professors" className="nav-link" style={{color: "black"}}>
                        <bs.Card.Img variant="top" src={professor} />
                        <bs.Card.Body>
                            <bs.Card.Title>Professors</bs.Card.Title>
                            <bs.Card.Text>
                            Top professors by department and class.
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem' }}>
                        <Link to="/table1" className="nav-link" style={{color: "black"}}>
                        <bs.Card.Img variant="top" src={date} />
                        <bs.Card.Body>
                            <bs.Card.Title>Date Ideas</bs.Card.Title>
                            <bs.Card.Text>
                                Find the perfect date ranging from casual to romantic.
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    
                </bs.Row>
                <bs.Row style={{ marginTop: '100px' }}>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem' }}>
                        <Link to="/table1" className="nav-link" style={{color: "black"}}>
                        <bs.Card.Img variant="top" src={movie} />
                        <bs.Card.Body>
                            <bs.Card.Title>Movies/TV</bs.Card.Title>
                            <bs.Card.Text>
                                Find your next binge-worthy show on popular streaming platforms
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem' }}>
                        <Link to="/table1" className="nav-link" style={{color: "black"}}>
                        <bs.Card.Img variant="top" src={recipes} />
                        <bs.Card.Body>
                            <bs.Card.Title>Recipes</bs.Card.Title>
                            <bs.Card.Text>
                                A catalog of all kinds of great recipes.
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card style={{ width: '18rem' }}>
                        <Link to="/table1" className="nav-link" style={{color: "black"}}>
                        <bs.Card.Img variant="top" src={boardgame} />
                        <bs.Card.Body>
                            <bs.Card.Title>Games</bs.Card.Title>
                            <bs.Card.Text>
                                Find a new game for the next time your friends come over.
                            </bs.Card.Text>
                        </bs.Card.Body>
                        </Link>
                        </bs.Card>
                    </bs.Col>
                    
                </bs.Row>
            </bs.Container>
        </div>
        
        
    )
}

export default Home