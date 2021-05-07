import React, { useState, useEffect } from 'react'
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import SelectDepartment from './SelectDepartment'
import SelectCollege from './SelectCollege'
import SelectCourses from './SelectCourses'
import SelectProfessors from './SelectProfessors'
import MajorFinish from './MajorFinish'
import Form from "react-bootstrap/Form"

function MajorSurvey(props) {
    const [collegeID, setCollegeID] = useState();
    const history = useHistory();
    

    useEffect(() => {
        console.log(collegeID)
    })

    const handleClick = () => {
        if(collegeID){
            history.push(`/schools/survey/major/${collegeID}`)
        }
    }

    



    return (
        <Switch>
            <Route path="/survey/major/finish">
                <MajorFinish />
            </Route>
            <Route path="/survey/major/:sid/:did/courses">
                <SelectCourses />
            </Route>
            <Route path="/survey/major/:sid/:did/professors">
                <SelectProfessors />
            </Route>
            <Route path="/survey/major/:sid">
                <SelectDepartment />
            </Route>
            <Route path="/survey/major">
                <SelectCollege/>
        </Route>
        </Switch>
    )
}

export default MajorSurvey
