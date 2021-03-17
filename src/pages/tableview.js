import React, { useContext, useEffect, useState} from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { updateCourse as updateCourseMutation } from '../graphql/mutations';
import { updateProfessor as updateProfessorMutation } from '../graphql/mutations';
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import ClassImg from '../images/class.jpg'
import AppContext from '../context/context'


function TableView (props) {
    const match = useRouteMatch("/category/:cid")
    const [profs, setProfs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rankedItems, setRankedItems] = useState();
    const [ratings, setRatings] = useState({});
    let history = useHistory();


    const CLASS_VOTE_UP = "tableSelectedUp";
    const CLASS_VOTE_DOWN = "tableSelectedDown";
    const CLASS_NO_VOTE_DOWN = "tableNotSelectedDown";
    const CLASS_NO_VOTE_UP = "tableNotSelectedUp";
    const URL_PARAM_COURSES = "courses";
    const URL_PARAM_PROFESSORS = "professors"
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";

    useEffect(() => {
        rankItems();
    }, [])

    let rankItems = async() => {
        let catItems = props.categoryItems;
        let filteredItems = [];
        let paginatedItems = [];
        let endingIndex;
        let classes ;

        // for (let i = 0; i < props.departments.length; i++) {
        //     for(let j = 0; j < props.departments[i].courses.items.length; j ++){
        //         if(props.departments[i].courses.items[j].classes.courseID === match.params.oid){
        //             for (let k = 0; k < props.departments[i].courses.items[j].classes.length; k ++){ 
        //                 classes.push(props.departments[i].courses.items[j].classes[k].professor)
        //             }
        //         }
        //     }
        // }
     
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (catItems).sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < catItems.length; i++){
            catItems[i].ranking = i + 1;
            // if(catItems[i].professor.name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === catItems[i].id){
                        catItems[i].userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredItems.push(catItems[i])
            // }
        }

        for (let i = props.pageStartIndex; paginatedItems.length < 10; i++){
                
            if(filteredItems[i]){
                paginatedItems.push(filteredItems[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }

        let newRatings ={};
        catItems.forEach(item => {
            if(item.userRating){
                newRatings[item.id] = item.userRating;
            }
        })
        console.log(newRatings);
        setRatings(newRatings);

        setRankedItems(paginatedItems);
        setIsLoading(false);

    }

    let handleRatingClick = (id, increment, mutation, score, item) => {
        setIsLoading(true);
        let tempRatings = {};
        for (const [key, value] of Object.entries(ratings)) {
            tempRatings[key] = value;
        }






        if (increment === VOTE_UP){
            if (tempRatings[id] === VOTE_UP){
                item.score -= 1;
                delete tempRatings[id];
            } else if (tempRatings[id] === VOTE_DOWN) {
                item.score += 2;
                tempRatings[id] = increment;
            } else if (!tempRatings[id]) {
                item.score += 1;
                tempRatings[id] = increment;
            }
        } else if (increment === VOTE_DOWN) {
            if (tempRatings[id] === VOTE_UP){
                item.score -= 2;
                tempRatings[id] = increment;
            } else if (tempRatings[id] === VOTE_DOWN) {
                item.score += 1;
                delete tempRatings[id];
            } else if (!tempRatings[id]) {
                item.score -= 1;
                tempRatings[id] = increment;
            }
        }
        

        console.log("old ratings",ratings);
        setRatings(tempRatings);
        console.log("new ratings",ratings);
        
        
        // props.createRating(id, increment, mutation, score);
        setIsLoading(false)
    }


    let handleClick = (id) => {
        history.push(`/category/${id}`);
    }

    if(!isLoading){
        if(rankedItems[0]){
            console.log(props.categoryItems)
                return(
                    <div className="table">
                        {
                            rankedItems.map((catItem, index) => (
                                <div className="ratingRow" key={index}>
                                    
                                <div key={index} className="tableItem" >
                                    <div className="scoreInfo">                               
                                        <div className={"ratingButtons"}>
                                            <div className={ratings[catItem.id] === VOTE_UP ? CLASS_VOTE_UP : CLASS_NO_VOTE_UP }  onClick={() => handleRatingClick( catItem.id, VOTE_UP, updateCourseMutation, catItem.score, catItem)}>
                                            <AiIcons.AiFillUpCircle />
                                            </div>
                                            
                                        </div>
                                        <div className="scoreDisplay">
                                            {catItem.score} Points
                                        </div>
                                        <div className={"ratingButtons"}>
                                            <div className={ratings[catItem.id] === VOTE_DOWN ? CLASS_VOTE_DOWN : CLASS_NO_VOTE_DOWN }  onClick={() => handleRatingClick(catItem.id, VOTE_DOWN, updateCourseMutation, catItem.score, catItem)}>
                                            <AiIcons.AiFillDownCircle />                                              
                                            </div>
                                           
                                        </div>
                                        
                                    </div>
                                    <div className="tableItemImg" onClick={() => {handleClick(catItem.id)}}>
                                        <img className="profile" alt={catItem.name} style={{height:"100%", width: "80%"}} src={ClassImg} />
    
                                    </div>
                                    <div className="tableItemContent" onClick={() => {handleClick(catItem.id)}}>
                                        <div className="tableItemTitle">
                                            <div className={"tableItemTitleRanking"}>
                                                {catItem.ranking === 1 ? 
                                                        <img  alt={catItem.name} style={{height:"40px", width: "50px"}} src="data:image/png;base64,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" /> 
                                                        : `#${catItem.ranking}`}
                                            </div>
                                            <div className={"tableItemTitleHeading"}>
                                                {catItem.name}
                                            </div>
                                        </div>
                                        <div className="tableItemSubtitle">
                                            {/* {catItem.department.name} in {catItem.department.school.name} */}
    
                                        </div>
    
    
                                        <div className="tableItemDetails">
                                            <p>{catItem.description}</p>
                                        </div>
      
                                    </div>
                                    <div className="tableItemExtra">
                                            <bs.Dropdown >
                                                <bs.Dropdown.Toggle  className="cardEllipsis" id="dropdown-basic">
                                                    <FaIcons.FaEllipsisH />
                                                </bs.Dropdown.Toggle>
    
                                                <bs.Dropdown.Menu>
                                                    <bs.Dropdown.Item href={`${match.url}/${catItem.id}`}>View Details</bs.Dropdown.Item>
                                                    <bs.Dropdown.Item href="">Save {catItem.name}</bs.Dropdown.Item>
                                                    <bs.Dropdown.Item onClick={() => alert("Thank you uploading a photo.")}>Upload Photo</bs.Dropdown.Item>
                                                    <bs.Dropdown.Item onClick={() => alert("Thank you for marking " + catItem.name + " as a duplicate.")}>Mark Duplicate</bs.Dropdown.Item>
                                                    <bs.Dropdown.Item onClick={() => alert("Thank you for reporting this. Our moderators will review " + catItem.name + ".")}>Report</bs.Dropdown.Item> 
                                                </bs.Dropdown.Menu>
                                            </bs.Dropdown>
    
                                        </div>
                                </div>
                                </div>
                            ))
                        }
                        
                    </div>
                    
                )
                
            
        } else {
            return(
                // <bs.Spinner animation="border" role="status">
                //     <span className="sr-only">Loading...</span>
                // </bs.Spinner>
                <p>No Data</p>
            )
        }
    } else {
        return(
            <bs.Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </bs.Spinner>
        )
    }

    
    
    
}

export default TableView;