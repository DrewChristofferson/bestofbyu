import React from 'react'
import { Link } from 'react-router-dom'

function MajorFinish() {
    return (
        <div>
            Thank you for giving us your feedback!
            <p>Want to do more?</p>
            <Link to="/survey/ge">Recommend General Education Courses</Link><br/>
            <Link to="/survey/major">Recommend Courses From Another Department</Link>
        </div>
    )
}

export default MajorFinish
