import React, { useEffect, useState, useContext } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom'
import { getProfessor, getCourse, listRatings } from '../graphql/queries'
import { API } from 'aws-amplify'
import ProfessorTable from './professortable'
import AppContext from '../context/context'
import Table from './table'
import DataLineChart from '../utilities/linechart'
import DataPieChart from '../utilities/piechart'
import CreateModalClass from '../utilities/createclassmodal'
import { ratingsByUserAndContent, listDepartments } from '../graphql/queries';
import { createRating as createRatingMutation } from '../graphql/mutations';
import { updateRating as updateRatingMutation } from '../graphql/mutations';
import { deleteRating as deleteRatingMutation } from '../graphql/mutations';
import img1 from '../images/detailplaceholders/one.jpg'
import img2 from '../images/detailplaceholders/two.jpg'
import img3 from '../images/detailplaceholders/three.jpg'
import img4 from '../images/detailplaceholders/four.jpg'
import img5 from '../images/detailplaceholders/five.jpg'
import img6 from '../images/detailplaceholders/six.jpg'
import img7 from '../images/detailplaceholders/seven.jpg'


function Detail(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
    let history = useHistory();
    const [professor, setProfessor] = useState();
    const [course, setCourse] = useState();
    const [type, setType ] = useState(match.params.type);
    const [departments, setDepartments] = useState({});
    const [professorsForCourse, setProfessorsForCourse] = useState([]);
    const [ratings, setRatings] = useState();
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [comments, setComments] = useState();
    const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
    const [name, setName] = useState("");
    const context = useContext(AppContext)
    const VOTE_UP  = "up";
    const VOTE_DOWN = "down";
    const location = useLocation();




    useEffect(() => {
        //navigates user to the top of the page on page load
        window.scrollTo(0, 0);
        fetchData();
        fetchRatings();
        props.getRatings(context.userid)
        getProfessors();
    }, []);

    useEffect(() => {
        console.log("changed location");
        fetchData();
        setProfessor(null);
        setCourse(null);
    }, [location]);


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

    async function updateScore(id, score, increment, mutationName) {
        try{
            if (increment === VOTE_UP) {
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score + 1} } });
            }    
            else if (increment === VOTE_DOWN){
                await API.graphql({ query: mutationName, variables: { input: {"id": id, "score": score - 1} } });
            }
        }
        catch (e) {
            return e;
        }
  
      }

    async function createRating(contentID, type, mutationName, score) {
        let ratingIdFromAPI;
        if (!context.userid) return;
        try {
            const ratingData = await API.graphql({ query: ratingsByUserAndContent, variables: { "userID": context.userid, "contentID": {eq: contentID } }});
            ratingIdFromAPI = ratingData.data.ratingsByUserAndContent.items;
        } catch (e) {
            return e;
        }
        if(ratingIdFromAPI[0] === undefined){
            try {
                await API.graphql({ query: createRatingMutation, variables: { input: { "contentID": contentID, "userID": context.userid, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            } finally {
                //fetchData();
            }
        } else if (ratingIdFromAPI[0].ratingType === type){
            type === VOTE_UP ? type = VOTE_DOWN : type = VOTE_UP;
            try {
                await API.graphql({ query: deleteRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                //fetchData();
            }
        } else {
            type === VOTE_UP ? score += 1 : score -= 1;
            try {
                await API.graphql({ query: updateRatingMutation, variables: { input: { "id": ratingIdFromAPI[0].id, "ratingType": type } }});
                updateScore(contentID, score, type, mutationName);
                //getRatings(userid);
            } catch (e) {
                return e;
            }finally {
                //fetchData();
            }
        }
    }


   async function fetchData() {
       setIsLoadingProfessors(true)
       if(match.params.type === "professors") {
            try{ 
                const apiData = await API.graphql({ query: getProfessor, variables: { id: match.params.oid }  });
                setProfessor(apiData.data.getProfessor)
                setName(apiData.data.getProfessor.name)
                setComments(apiData.data.getProfessor.comments.items)
                setIsLoadingComments(false);
            } catch (e) {
                console.log('Error: ' + e)
            }
       } else if (match.params.type === "courses"){
            try{ 
                const apiData = await API.graphql({ query: getCourse, variables: { id: match.params.oid } });
                setCourse(apiData.data.getCourse);
                setName(apiData.data.getCourse.code)
                setIsLoadingCourse(false);

                if(apiData.data.getCourse.classes) {
                    let profsFromAPI = apiData.data.getCourse.classes.items;
                    await Promise.all(profsFromAPI.map(async professor => {
                        return professor;
                      })).then((values) => {
                        setProfessorsForCourse(values);
                        setIsLoadingProfessors(false);
                      }) 
                } else {
                    setIsLoadingProfessors(false);
                }
            } catch (e) {
                console.log(e)
            }
       } else {
           return (
               <h1>No data</h1>
           )
       }
   }

   let getRanking =  () => {
        let objectsAll = [];
        let rankingAll = 0;
        let rankingSchool = 0;
        let rankingDept = 0;

        if (props.departments[0]) {
            if (match.params.type === "courses") {
                for (let i = 0; i < props.departments.length; i++) {
                    for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                        objectsAll.push(props.departments[i].courses.items[j]);
                    }
                }
        
            } else if (match.params.type === "professors"){
                for (let i = 0; i < props.departments.length; i++) {
                    for(let j = 0; j < props.departments[i].professors.items.length; j ++){
                        objectsAll.push(props.departments[i].professors.items[j]);
                    }
                }
    
            } else return null;
    
            objectsAll.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
    
            for (let i = 0; i < objectsAll.length; i++){
                rankingAll++;
                if (objectsAll[i].id === match.params.oid){
                    break;
                }
            }
            for (let i = 0; i < objectsAll.length; i++){
                if(objectsAll[i].department.school.id === (match.params.type === "courses" ? course.department.school.id : professor.department.school.id)){
                    rankingSchool++;
                    if (objectsAll[i].id === match.params.oid){
                        break;
                    }
                }
            }
            for (let i = 0; i < objectsAll.length; i++){
                if(objectsAll[i].department.id === (match.params.type === "courses" ? course.department.id : professor.department.id)){
                    rankingDept++;
                    if (objectsAll[i].id === match.params.oid){
                        break;
                    }
                }
            }
        
            let strRankingAll =  rankingAll.toString()
            let strRankingDept =  rankingDept.toString()
            let strRankingSchool =  rankingSchool.toString()
            
                
            return [createOrdinalNumber(strRankingDept), createOrdinalNumber(strRankingSchool), createOrdinalNumber(strRankingAll)];
        }

        
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




    let getProfessors = async() => {
        let professors = [];
        let filteredProfessors = [];
        let paginatedProfessors = [];
        let endingIndex;
        let classes ;

        for (let i = 0; i < props.departments.length; i++) {
            for(let j = 0; j < props.departments[i].courses.items.length; j ++){
                if(props.departments[i].courses.items[j].classes.courseID === match.params.oid){
                    for (let k = 0; k < props.departments[i].courses.items[j].classes.length; k ++){ 
                        classes.push(props.departments[i].courses.items[j].classes[k].professor)
                    }
                }
            }
        }
     
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (professorsForCourse).sort((a, b) => (a.professor.score < b.professor.score) ? 1 : (a.professor.score === b.professor.score) ? ((a.professor.name > b.professor.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < professorsForCourse.length; i++){
            professorsForCourse[i].professor.ranking = i + 1;
            if(professorsForCourse[i].professor.name.toLowerCase().includes(props.searchFilter.toLowerCase())){
                for(let j = 0; j < props.userRatings.length; j++){
                    if (props.userRatings[j].contentID === professorsForCourse[i].professor.id){
                        professorsForCourse[i].professor.userRating = props.userRatings[j].ratingType;
                    }   
                }
                filteredProfessors.push(professorsForCourse[i].professor)
            }
        }

        for (let i = props.pageStartIndex; paginatedProfessors.length < 10; i++){
                
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }

        return(paginatedProfessors);

    }
        
    let getGoat = () => {
        return(
            <img  alt="Goat" style={{height:"25px", width: "31px"}} src="data:image/png;base64,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" />
        )
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
                    <p>No comments for {professor.name}.</p>
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
   

   let returnProfessors = () => {
       if (isLoadingCourse || isLoadingProfessors){
            return(
                <div style={{height: "200px"}}>
                    <bs.Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </bs.Spinner>
                </div>
                
            )
       } else {   
            if(!isLoadingProfessors){
                return(
                    <bs.Container style={{paddingTop: "2rem"}} fluid>
                        <Table 
                            getDepartments={props.getDepartments}
                            professorsDetail={getProfessors()}
                            refreshProfessors={fetchData}
                            getRatings={props.getRatings}
                            courseid={course.id}
                            getImg={getImg}
                            createRating={createRating} 
                            pageNum={props.pageNum}
                            detail={true}
                        />  
                    </bs.Container>
                )
            }
            //  else{
            //     return(
            //         <bs.Spinner animation="border" role="status">
            //             <span className="sr-only">Loading...</span>
            //         </bs.Spinner>
            //     )
            // }
           
                

        } 
    }


   

   if (course && match.params.type === "courses"){
       return(
           <div>
               <div className={"backButton"}>
                    <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
               </div>

             

                <div className={"detailContent"}>
                    <div className={"detailChildTitle"}>
                        <h2>{course.name}</h2>
                        <h3>{course.code}</h3>
                        <h5>{ course.description }</h5>
                    </div>
                    {/* <div className={"detailChild"}>
                        <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}
                    </div> */}
                    <div className={"detailChild"}>
                        
                        <h5>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h5> 
        
                        <h5>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h5>

                        <h5>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h5>
                    </div>
                </div>
                <div className={"chartContent"}>
                    <div className={"detailChild"}>
                        <h3>Overall Score: {course.score}</h3>
                        <DataPieChart data={initPieData()}/>
                    </div>
                    <div className={"detailChild"}>
                        <h3>Score for {course.code}</h3><h6>(past 6 months)</h6>
                        <DataLineChart data={initChartData()}/>
                    </div>
                    
                </div>
                   

                     <bs.Tabs defaultActiveKey="professors" id="controlled-tab-example">
                     <bs.Tab eventKey="professors" title="Professors" style={{paddingTop: "3em"}}>
                             <CreateModalClass fetchData={fetchData}/>  
                             {/* <DataLineChart data={dataProfessors}/>                       */}
                             {returnProfessors()}
                         </bs.Tab>
                         <bs.Tab eventKey="about" title="About">
                             <h3 style={{paddingTop:"2rem"}}>Description</h3>
                             <p>Write an unbiased description of {course.name}. </p>
                             <bs.Button variant="info">Edit Description</bs.Button>
                         </bs.Tab>
                         <bs.Tab eventKey="discussion" title="Discussion">
                             <h3 style={{paddingTop:"2rem"}}>Comments</h3>
                             <p>No comments yet for {course.name}</p>
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
   else if (professor && match.params.type === "professors"){
    return(
        <bs.Container fluid style={{marginRight: "3rem", marginLeft: "3rem"}}>
            <bs.Row style={{paddingTop: "1rem"}}>
                <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
            </bs.Row>
            <bs.Row style={{paddingTop: "3rem"}}>
                <bs.Col md="1"></bs.Col>
                <bs.Col sm="1" style={{marginLeft: "auto", marginRigt: "0"}}>
                   {getImg(professor)}
                </bs.Col>
                <bs.Col md="6" style={{paddingLeft: "5rem"}}>
                    <bs.Row >
                        <bs.Col style={{padding: "0"}}>
                            <h2>{professor.name}</h2>
                        </bs.Col>
                        <bs.Col>
                            
                        </bs.Col>
                    </bs.Row>
                    <bs.Row>
                        <h5>{ professor.title }</h5>
                    </bs.Row>
                    <bs.Row>
                        <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                        <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}


                    </bs.Row>
                   
                  
                    
                </bs.Col>
                <bs.Col md="4">
                    <bs.Row>
                        
                      <h4>Score: {professor.score}</h4>

                    </bs.Row>
                    <bs.Row style={{marginTop: "10px"}}>
                        
                        <h5>{getRanking()[0] === "1st" ? getGoat() : getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h5> 
                    </bs.Row>
                    <bs.Row>
                        <h5>{getRanking()[1] === "1st" ? getGoat() : getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{professor.department.school.name}</Link>{"\n"}</h5>

                    </bs.Row>
                    <bs.Row>
                    <h5>{getRanking()[2] === "1st" ? getGoat() : getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h5>

                    </bs.Row>
                </bs.Col>
                
            </bs.Row>
            <bs.Container fluid style={{marginRight: "10rem", marginLeft: "10rem"}}>
                    <bs.Row style={{paddingTop: "5em"}}>
                        <bs.Col xl="4">

                                <DataPieChart data={initPieData()}/>

                                
                        </bs.Col>
                        <bs.Col xl="6" style={{marginRight: "auto", marginLeft: "0", textAlign: "center"}}>
                            <h3>Score for {professor.name}</h3><h6>(past 6 months)</h6>
                            <DataLineChart data={initChartData()}/>
                        </bs.Col>
                    
                    </bs.Row>
                </bs.Container>

            <bs.Row style={{marginTop: "3em", marginBottom: "3em"}}>
                <bs.Col md="1"></bs.Col>
                <bs.Col md="10">
                    <bs.Tabs defaultActiveKey="home" id="controlled-tab-example">
                        <bs.Tab eventKey="home" title="About">
                            <h3 style={{paddingTop:"2rem"}}>Description</h3>
                            <p>Write an unbiased description of {professor.name}. </p>
                            <bs.Button variant="info">Edit Description</bs.Button>
                        </bs.Tab>
                        <bs.Tab eventKey="profile" title="Discussion">
                            <h3 style={{paddingTop:"2rem"}}>Comments</h3>
                            {returnComments()}
                            <bs.Form style={{paddingLeft: "1rem"}}>
                                <bs.Form.Group controlId="exampleForm.ControlInput" >
                                    <bs.Form.Control type="text" placeholder="Post a new comment..." onChange={(e) => console.log("new comment",e.target.value)}/>
                                </bs.Form.Group>
                                <bs.Button variant="primary">Post Comment</bs.Button>
                            </bs.Form>
                        </bs.Tab>
                        <bs.Tab eventKey="contact" title="Pictures" >
                            <h3 style={{paddingTop:"2em"}}>Picutres</h3>
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
                </bs.Col>
                <bs.Col md="1"></bs.Col>
            </bs.Row>
        </bs.Container>
    )
   } else{
    return(
     <bs.Spinner animation="border" role="status">
         <span className="sr-only">Loading...</span>
     </bs.Spinner>
 )
}
    

}

export default Detail;