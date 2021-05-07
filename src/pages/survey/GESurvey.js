import React, {useState} from 'react'
import GECourses from './GECourses'
import GEProfessors from './GEProfessors'
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'


function GESurvey() {
    const [ratingCourses, setRatingCourses] = useState({})
    const [courses, setCourses] = useState({})

    const updateRatingCourses = (courses) => {
        setRatingCourses(courses)
    }
    const updateCourses = (courses) => {
        setCourses(courses)
    }

    return (
        <Switch>
            <Route path="/survey/ge/professors">
                <GEProfessors updateRatingCourses={updateRatingCourses} ratingCourses={ratingCourses} updateCourses={updateCourses} courses={courses}/>
            </Route>
            <Route path="/survey/ge">
                <GECourses updateRatingCourses={updateRatingCourses} updateCourses={updateCourses} courses={courses}/>
            </Route>
        </Switch>
        
    )
}

export default GESurvey
