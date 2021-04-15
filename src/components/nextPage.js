import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleRight} from '@fortawesome/free-solid-svg-icons'

function NextPage (props) {
    
    if(props.pageNum < props.numPages){
        return <FontAwesomeIcon  style={{cursor: "pointer"}} icon={faChevronCircleRight} onClick={() => props.nextPage(props.myIndex)}/>;
    } else {
        return null;
    }   
}

export default NextPage;