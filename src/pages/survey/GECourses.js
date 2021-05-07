import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import objGE from '../../geobject'
import Form from "react-bootstrap/Form"
import {listCourses} from '../../graphql/queries';
import { API } from 'aws-amplify'
import {BiHappy} from 'react-icons/bi'
import {BiSad} from 'react-icons/bi'
import DifficultyRater from './DifficultyRater'

function GECourses(props) {
    const [selected, setSelected] = useState({})
    const [rated, setRated] = useState({})
    const [recRating, setRecRating] = useState({})
    const [difRatings, setDifRatings] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    let tempCourses = [];
    const history = useHistory();

    useEffect(() => {
        fetchCourses();
    }, [])

    async function fetchCourses(nextToken) {
        let apiData;
        if(nextToken){
            apiData = await API.graphql({ query: listCourses, variables: {limit: 5000, nextToken: nextToken, filter: {isGeneral: {eq: true}}}});
        } else {
            apiData = await API.graphql({ query: listCourses, variables: {limit: 5000, filter: {isGeneral: {eq: true}}}});
        }
        tempCourses = [...tempCourses, ...apiData.data.listCourses.items]
        tempCourses.sort((a, b) => (a.code > b.code) ? 1 : -1 )
        props.updateCourses(tempCourses)
        if(apiData.data.listCourses.nextToken){
            fetchCourses(apiData.data.listCourses.nextToken)
        } else {
            setIsLoading(false)
        }
    }


    const clickHappy = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(recRating)) {
            tempRatings[key] = value;
        }
        for (const [key, value] of Object.entries(difRatings)) {
            tempDifRatings[key] = value;
        }

        if(tempRatings[id] === 'up'){
            delete tempRatings[id];
            if(tempDifRatings[id]){
                delete tempDifRatings[id];
            }
        } else if (tempRatings[id] === 'down'){
            tempRatings[id] = 'up';
        } else {
            tempRatings[id] = 'up';
        }

        setRecRating(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const clickSad = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(recRating)) {
            tempRatings[key] = value;
        }
        for (const [key, value] of Object.entries(difRatings)) {
            tempDifRatings[key] = value;
        }

        if(tempRatings[id] === 'down'){
            delete tempRatings[id];
            if(tempDifRatings[id]){
                delete tempDifRatings[id];
            }
        } else if (tempRatings[id] === 'up'){
            tempRatings[id] = 'down';
        } else {
            tempRatings[id] = 'down';
        }

        setRecRating(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const updateDifRatings = (newRatings) => {
        setDifRatings(newRatings)
    }


    const handleSelect = (e,id) => {
        e.preventDefault()
        if(selected[id]){
            setRated({...rated, [id]: selected[id]})
        }
    }

    const handleClick = () => {
        props.updateRatingCourses(rated)
        history.push(`/survey/ge/professors`)
    }


    return (
        <div>
            <h2>General Education Survey</h2>
            {

                !isLoading ?
            
                Object.entries(objGE).map(([key, value]) => {
                    return (
                        <div>
                        <p key={key}>{value}</p>
                        <Form >
                        {/* {
                            colleges ? */}
                                <Form.Group 
                                    controlId="exampleForm.ControlDropdown1" 
                                    onChange={e => setSelected({...selected, [key]: e.target.value})}
                                >
                                    <Form.Label className="my-1 mr-2" >
                                        What course did you take for {value}?
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        {
                                            props.courses.map((course) => {
                                                if(course.generalReqID[0] === key || course.generalReqID[1] === key || course.generalReqID[2] === key){
                                                    return(
                                                        <option value={`${course.id}*${course.code}`} key={course.id}>{course.code} - {course.name}</option>
                                                    )
                                                }
                                                
                                            })
                                        }
                        
                                    </Form.Control>
                                </Form.Group>
                                <button onClick={(e) => handleSelect(e,key)}>Rate</button>
                                {
                                    rated[key] ?
                                    <div>
                                        <BiHappy onClick={() => clickHappy(key)} size={50} style={recRating[key] === 'up' ? { color: 'green', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                                        <BiSad onClick={() => clickSad(key)} size={50} style={recRating[key] === 'down' ? { color: 'red', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                                        <DifficultyRater selected={selected} difRatings={difRatings} updateDifRatings={updateDifRatings} id={key} />
                                    </div>
                                    :
                                    <></>
                                }
                                {/* :
                                <></>
                        } */}
                    </Form>
                    
                    </div>
                    )
                })
                :
                <></>
            
            }
            <button onClick={handleClick} >Next</button>
        </div>
        
    )
}

export default GECourses
