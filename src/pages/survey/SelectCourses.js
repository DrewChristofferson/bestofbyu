import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { coursesByDeptID} from '../../graphql/queries';
import { API } from 'aws-amplify';
import {BiHappy} from 'react-icons/bi'
import {BiSad} from 'react-icons/bi'
import DifficultyRater from './DifficultyRater'

function SelectCourses() {
    const [courses, setCourses] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState({});
    const [difRatings, setDifRatings] = useState({});
    const match = useRouteMatch("/survey/major/:sid/:did")
    const history = useHistory();

    useEffect(() => {
        fetchCourses();
    }, [])

    async function fetchCourses() {
        
        const apiData = await API.graphql({ query: coursesByDeptID, variables: {type: 'Course', departmentID: {eq: match.params.did}, sortDirection: 'DESC', limit: 490}});
        console.log(apiData.data.coursesByDeptID.items)
        setCourses(apiData.data.coursesByDeptID.items)
        setIsLoading(false)
    }

    const clickHappy = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(selected)) {
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

        setSelected(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const clickSad = (id) => {
        let tempRatings = {};
        let tempDifRatings ={};
        for (const [key, value] of Object.entries(selected)) {
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

        setSelected(tempRatings)
        setDifRatings(tempDifRatings)
    }

    const updateDifRatings = (newRatings) => {
        setDifRatings(newRatings)
    }

    const handleClick = () => {
        history.push(`${match.url}/professors`)
    }

    return (
        <div>
            <h2>Major Survey</h2>
            <p>What courses have you taken?</p>
            {
                isLoading ?
                <></>
                :
                courses[0] ?
                courses.map(course => {
                    return(
                        <div key={course.id}>
                            <p>{course.code}  -  {course.name}</p> 
                            <BiHappy onClick={() => clickHappy(course.id)} size={50} style={selected[course.id] === 'up' ? { color: 'green', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <BiSad onClick={() => clickSad(course.id)} size={50} style={selected[course.id] === 'down' ? { color: 'red', cursor: 'pointer'} : { color: 'black', cursor: 'pointer'}}/>
                            <DifficultyRater selected={selected} difRatings={difRatings} updateDifRatings={updateDifRatings} id={course.id} />
                        </div>
                    )
                })
                :
                <p>Bummer! We didn't find any courses in this department. Click next to see professors.</p>
            }
            <button onClick={handleClick}>Next</button>
        </div>
    )
}

export default SelectCourses
