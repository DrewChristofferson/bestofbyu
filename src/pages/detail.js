import React, { useEffect, useState, useContext } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, getCourse, listRatings, getCategoryItem } from '../graphql/queries'
import { API } from 'aws-amplify'
import AppContext from '../context/context'
import DataLineChart from '../utilities/linechart'
import DataPieChart from '../utilities/piechart'
import CreateModalClass from '../utilities/createclassmodal'
import img1 from '../images/detailplaceholders/one.jpg'
import img2 from '../images/detailplaceholders/two.jpg'
import img3 from '../images/detailplaceholders/three.jpg'
import img4 from '../images/detailplaceholders/four.jpg'
import img5 from '../images/detailplaceholders/five.jpg'
import img6 from '../images/detailplaceholders/six.jpg'
import img7 from '../images/detailplaceholders/seven.jpg'


function Detail(props) {
    const match = useRouteMatch("/category/:cid/:oid")
    let history = useHistory();
    const [categoryItem, setCategoryItem] = useState();
    const [course, setCourse] = useState();
    const [professorsForCourse, setProfessorsForCourse] = useState([]);
    const [ratings, setRatings] = useState();
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [comments, setComments] = useState();
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [name, setName] = useState("");
    const context = useContext(AppContext)




    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
        fetchData();
        fetchRatings();
        props.getRatings(context.userid)
    }, []);


   let getMonthName = (monthNum) => {
    let currDate = new Date();
    currDate.setMonth(currDate.getMonth()-monthNum);
    const previousMonth = currDate.toLocaleString('default', { month: 'long' });

    return previousMonth;
 }

    let getRatingCount = (monthNum, type) => {
        const myRegex = /^(.*)-(.*)-(.*)$/
        if (Number.isInteger(monthNum)) {
            //the getMonth() method gets the index and not the actual month number
            //subtracting one will offset this in the comparison below
            monthNum -= 1;
        }
        let currDate = new Date();
        let count = 0;
        ratings.forEach(rating => {
            //parse the date from the database
            //date: "YYY-MM-DD"
            let date = rating.updatedAt.split('T')[0];
            let match = myRegex.exec(date);
            //year: "YYYY"
            let year = match[1];
            //month: "MM"
            let month = match[2];
            //day: "DD"
            let day = match[3];

            if(type === "getUpVotes" && rating.ratingType === "up"){
                if(parseInt(year) < currDate.getFullYear()){
                    count++
                }
                else if (parseInt(year) === currDate.getFullYear() && parseInt(month) <= currDate.getMonth()-monthNum) {
                    count++;
                }    
            }
            if(type === "getDownVotes" && rating.ratingType === "down"){
                if(parseInt(year) < currDate.getFullYear()){
                    count++
                }
                else if (parseInt(year) === currDate.getFullYear() && parseInt(month) <= currDate.getMonth()-monthNum) {
                    count++;
                }   
            }
        })
        return count;
    }

   const dataProfessors = [
    {
      name: 'May',
      'Degan Kettles': 400,
      'Greg Andersen': 240,
      'Stephen Liddle': 240,
      'Gove Allen': 240
    },
    {
      name: 'June',
      'Degan Kettles': 300,
      'Greg Andersen': 139,
      'Stephen Liddle': 221,
      'Gove Allen': 221,
    },
    {
      name: 'July',
      'Degan Kettles': 200,
      'Greg Andersen': 980,
      'Stephen Liddle': 229,
      'Gove Allen': 229,
    },
    {
      name: 'August',
      'Degan Kettles': 278,
      'Greg Andersen': 390,
      'Stephen Liddle': 200,
      'Gove Allen': 200
    }
  ];

    let initChartData = () => {
        if(!isLoadingRatings){
            const dataElement = [
                {
                  name: getMonthName(6),
                  [name]: getRatingCount(6, "getUpVotes") - getRatingCount(6, "getDownVotes"),
                  'TODO: Avg Score': 0
                },
                {
                  name: getMonthName(5),
                  [name]: getRatingCount(5, "getUpVotes") - getRatingCount(5, "getDownVotes"),
                  'TODO: Avg Score': 2
                },
                {
                  name: getMonthName(4),
                  [name]: getRatingCount(4, "getUpVotes") - getRatingCount(4, "getDownVotes"),
                  'TODO: Avg Score': -1
                },
                {
                  name: getMonthName(3),
                  [name]: getRatingCount(3, "getUpVotes") - getRatingCount(3, "getDownVotes"),
                  'TODO: Avg Score': -2
                },
                {
                  name: getMonthName(2),
                  [name]: getRatingCount(2, "getUpVotes") - getRatingCount(2, "getDownVotes"),
                  'TODO: Avg Score': 1
                },
                {
                    name: getMonthName(1),
                    [name]: getRatingCount(1, "getUpVotes") - getRatingCount(1, "getDownVotes"),
                    'TODO: Avg Score': 4
                },
                {
                  name: getMonthName(0),
                  [name]: getRatingCount(0, "getUpVotes") - getRatingCount(0, "getDownVotes"),
                  'TODO: Avg Score': 6
                }
                
              ];
              
              return dataElement;
        }
        else {
            return(
                [
                    {
                        "name": "invalid",
                        "datapoint": 2

                    }
                ]
            )
        }
        
    }
    let initPieData = () => {
        if(!isLoadingRatings){
            const dataPie = [
                { name: "Up", value: getRatingCount(0, "getUpVotes") },
                { name: "Down", value: getRatingCount(0, "getDownVotes") }
              ];
              
            return dataPie;
        }
        else {
            return(
                [
                    { name: "Up", value: 8 },
                    { name: "Down", value: 3 }
                ]
            )
        }
        
    }


   async function fetchData() {
        try{ 
            const apiData = await API.graphql({ query: getCategoryItem, variables: { id: match.params.oid }  });
            setCategoryItem(apiData.data.getCategoryItem)
            setName(apiData.data.getCategoryItem.name)
            // setComments(apiData.data.getCategoryItem.comments.items)
            setIsLoadingComments(false);
        } catch (e) {
            console.log('Error: ' + e)
        }

   }

   let getRanking =  () => {
        let objectsAll = [];
        let rankingAll = 0;
        let rankingSchool = 0;
        let rankingDept = 0;
        let catItems = props.categoryItems;

    
      

        catItems.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )

    for (let i = 0; i < catItems.length; i++){
        rankingAll++;
        if (catItems[i].id === match.params.oid){
            break;
        }
    }
    // for (let i = 0; i < objectsAll.length; i++){
    //     if(objectsAll[i].department.school.id === (match.params.type === "courses" ? course.department.school.id : professor.department.school.id)){
    //         rankingSchool++;
    //         if (objectsAll[i].id === match.params.oid){
    //             break;
    //         }
    //     }
    // }
    // for (let i = 0; i < objectsAll.length; i++){
    //     if(objectsAll[i].department.id === (match.params.type === "courses" ? course.department.id : professor.department.id)){
    //         rankingDept++;
    //         if (objectsAll[i].id === match.params.oid){
    //             break;
    //         }
    //     }
    // }

    let strRankingAll =  rankingAll.toString()
    let strRankingDept =  rankingDept.toString()
    let strRankingSchool =  rankingSchool.toString()
    
        
    return [createOrdinalNumber(strRankingDept), createOrdinalNumber(strRankingSchool), createOrdinalNumber(strRankingAll)];
}

    let createOrdinalNumber = (strRanking) => {
        let lastDigit = strRanking[strRanking.length - 1];
        let strRankingWithoutLastDigit = strRanking.substring(0, strRanking.length - 1);
        switch(strRanking){
            case "1":
                return "1st";
            case "2":
                return "2nd";
            case "3":
                return "3rd";
            case "11":
                return "11th";
            case "12":
                return "12th";
            case "13":
                return "13th";
            default:
                if (lastDigit === "1"){
                    return strRankingWithoutLastDigit + "1st";
                }
                else if (lastDigit === "2"){
                    return strRankingWithoutLastDigit + "2nd";
                }
                else if (lastDigit === "3") {
                    return strRankingWithoutLastDigit + "3rd";
                }
                else {
                    return `${strRanking}th`;
                }
        }
    }

   let fetchRatings = async() => {
       try {
        const apiData = await API.graphql({ query: listRatings, variables: {filter: { contentID: {eq: match.params.oid }  }}});

        const ratingsFromAPI = apiData.data.listRatings.items;

        await Promise.all(ratingsFromAPI.map(async rating => {
          return rating;
        }))
        setRatings(apiData.data.listRatings.items)
        setIsLoadingRatings(false);
       } catch (e) {
           console.log(e);
       }
   }


        

   let returnComments = () => {

        if(!isLoadingComments) {
            if(comments[0]){
                return( 
                    comments.map((comment) => ( 
                        <p style={{fontSize: "1.4rem"}}>{comment.content}</p>
                    )
                    )
                )    
            } else {
                return(
                    <p>No comments for {categoryItem.name}.</p>
                )
            }
        }
   }


    let getImg = (professor) => {
        if (professor.imgsrc){
            return(
                <img className="profile" alt={professor.name} style={{height:"200px", width: "180px", marginLeft: "auto", marginRight: "0"}} src={professor.imgsrc} />

            )
        } else {
            return(
                <img className="profile" alt={professor.name} style={{height:"100px", width: "100px"}} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
            )

        }
    }
   
   

   if(!categoryItem){
       return(
        <bs.Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </bs.Spinner>
    )
   } else {
       return(
           <div>
               <div className={"backButton"}>
                    <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
               </div>

             

                <div className={"detailContent"}>
                    <div className={"detailChildTitle"}>
                        <h2>{categoryItem.name}</h2>
                        <h5>{ categoryItem.description }</h5>
                    </div>
                    {/* <div className={"detailChild"}>
                        <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}
                    </div> */}
                    <div className={"detailChild"}>
                        
                        <h5>{getRanking()[0]} in <Link to={`/category/${match.params.cid}`}>TODO</Link>{"\n"}</h5> 
        
                        <h5>{getRanking()[1]} in <Link to={`/category/${match.params.cid}`}>TODO</Link></h5>

                        <h5>{getRanking()[2]} in <Link to={`/category/${match.params.cid}`}>All {props.category.name}</Link></h5>
                    </div>
                </div>
                {/* <div className={"chartContent"}>
                    <div className={"detailChild"}>
                        <h3>Overall Score: {course.score}</h3>
                        <DataPieChart data={initPieData()}/>
                    </div>
                    <div className={"detailChild"}>
                        <h3>Score for {course.code}</h3><h6>(past 6 months)</h6>
                        <DataLineChart data={initChartData()}/>
                    </div>
                    
                </div> */}
                   

                     <bs.Tabs defaultActiveKey="about" id="controlled-tab-example">
                     
                         <bs.Tab eventKey="about" title="About">
                             <h3 style={{paddingTop:"2rem"}}>Description</h3>
                             <p>Write an unbiased description of {categoryItem.name}. </p>
                             <bs.Button variant="info">Edit Description</bs.Button>
                         </bs.Tab>
                         <bs.Tab eventKey="discussion" title="Discussion">
                             <h3 style={{paddingTop:"2rem"}}>Comments</h3>
                             <p>No comments yet for {categoryItem.name}</p>
                             <bs.Form style={{paddingLeft: "1rem"}}>
                                 <bs.Form.Group controlId="exampleForm.ControlInput" >
                                     <bs.Form.Control type="text" placeholder="Post a new comment..." onChange={(e) => console.log("new comment",e.target.value)}/>
                                 </bs.Form.Group>
                                 <bs.Button variant="primary">Post Comment</bs.Button>
                             </bs.Form>

                         </bs.Tab>
                         <bs.Tab eventKey="pictures" title="Pictures" >
                             <h3 style={{paddingTop:"2rem"}}>Pictures</h3>
                             <div className={"imgContent"}>
                                 <img src={img1} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img2} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img3} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img4} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img5} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img6} height="200em" width="200em" alt="not found" className={"imgChild"}/>
                                 <img src={img7} height="200em" width="200em" alt="not found" className={"imgChild"}/>

                             </div>
                         </bs.Tab>
                     </bs.Tabs>
           </div>
            
               
                    
            
       );
   }

}

export default Detail;