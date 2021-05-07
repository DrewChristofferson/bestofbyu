import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import GESurvey from './GESurvey'
import MajorSurvey from './MajorSurvey'


function Survey() {
    return (
        <Switch>
            <Route path="/survey/ge">
                    <div style={{marginTop: "3rem"}}>
                    <GESurvey />
                    </div>
                    
                </Route>
                <Route path="/survey/major">
                    <div style={{marginTop: "3rem"}}>
                    <MajorSurvey/>
                    </div>
                    
                </Route>
                <Route path="/survey">
                    <div style={{marginTop: "3rem"}}>
                        Would you like to rate General Education courses or courses from your major?
                        <Link to="/survey/ge">General Education Courses</Link>
                        <Link to="/survey/major">Courses From My Major</Link>
                    </div>
                    
                </Route>
            </Switch>
    )
}

export default Survey
