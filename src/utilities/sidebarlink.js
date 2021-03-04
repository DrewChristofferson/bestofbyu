import React from 'react'
import { Link } from 'react-router-dom'

function SidebarLink (props) {
    const SIDEBAR_SELECTED = "sidebarSelected";
    const SIDEBAR_NOTSELECTED = "sidebarNotSelected";

    if (props.selectedSubLink !== undefined){
        return(
            <Link className={props.compareClassUrl === props.selectedSubLink ? SIDEBAR_SELECTED : SIDEBAR_NOTSELECTED} to={props.linkUrl} onClick={() => {props.handleClick(null, props.compareClassUrl)}}>{props.textContent}</Link>
        )
    } else if (props.selectedLink){
        return(
            <Link className={props.compareClassUrl === props.selectedLink ? SIDEBAR_SELECTED : SIDEBAR_NOTSELECTED} to={props.linkUrl} onClick={() => {props.handleClick(props.compareClassUrl, null)}}>{props.textContent}</Link>
        )
    } else return null;
    
}

export default SidebarLink;