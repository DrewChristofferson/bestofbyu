import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

function PreviousPage (props) {
    if(props.pageNum >= 2){
        return <FontAwesomeIcon style={{cursor: "pointer"}} icon={faChevronCircleLeft} onClick={() => props.previousPage(props.myIndex)}/>
    } else {
        return null;
    }
}

export default PreviousPage;