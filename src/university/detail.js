import React, { useEffect, useState, useContext } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, getCourse, listRatings } from '../graphql/queries'
import { API } from 'aws-amplify'
import ProfessorTable from './professortable'
import AppContext from '../context/context'
import Table from './table'
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
   const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
   let history = useHistory();
   const [professor, setProfessor] = useState();
   const [course, setCourse] = useState();
   const [professorsForCourse, setProfessorsForCourse] = useState([]);

   const [professorsOut, setProfessorsOut] = useState([]);
   const [ratings, setRatings] = useState();
   const [isLoadingRatings, setIsLoadingRatings] = useState(true);
   const [comments, setComments] = useState();
   const [isLoadingProfessors, setIsLoadingProfessors] = useState(true);
   const [isLoadingCourse, setIsLoadingCourse] = useState(true);
   const [isLoadingComments, setIsLoadingComments] = useState(true);
   const [isLoading, setIsLoading] = useState(true);
   const [items, setItems] = useState("1");
   const [name, setName] = useState("");
   const context = useContext(AppContext)

   const [feb_upRatingCount, setfeb_UpRatingCount] = useState(0);
   const [feb_downRatingCount, setfeb_DownRatingCount] = useState(0);
   const [jan_upRatingCount, setjan_UpRatingCount] = useState(0);
   const [jan_downRatingCount, setjan_DownRatingCount] = useState(0);


   
   let getMonthName = (monthNum) => {
    let currDate = new Date();

    currDate.setMonth(currDate.getMonth()-monthNum);
    const previousMonth = currDate.toLocaleString('default', { month: 'long' });

    console.log(previousMonth); // "September"
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
              
              console.log(dataPie, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
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


  

  



   useEffect(() => {
       //navigates user to the top of the page on page load
       window.scrollTo(0, 0);
       fetchData();
       fetchRatings();
       props.getRatings(context.userid)
       getProfessors();

       
     }, []);

     useEffect(() => {
         console.log(ratings, feb_upRatingCount, feb_downRatingCount);
         
     })


     

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
                console.log(apiData);
                setCourse(apiData.data.getCourse);
                setName(apiData.data.getCourse.code)
                setIsLoadingCourse(false);

                if(apiData.data.getCourse.classes) {
                    let profsFromAPI = apiData.data.getCourse.classes.items;
                    await Promise.all(profsFromAPI.map(async professor => {
                        return professor;
                      })).then((values) => {
                        console.log(values);
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
    console.log(strRankingAll)
    let strRankingDept =  rankingDept.toString()
    console.log(strRankingDept)
    let strRankingSchool =  rankingSchool.toString()
    console.log(strRankingSchool)
    
        
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
                        console.log(props.departments[i].courses.items[j].classes[k])
                    }
                }
            }
        }
        console.log(professors);
     
        console.log("_____________________", classes);
        //sorting function details found at https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        (professorsForCourse).sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.name > b.name) ? 1 : -1) : -1 )
                
        for (let i = 0; i < professorsForCourse.length; i++){
            console.log(professorsForCourse[i])
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

        console.log(filteredProfessors)

        for (let i = props.pageStartIndex; paginatedProfessors.length < 10; i++){
                
            if(filteredProfessors[i]){
                paginatedProfessors.push(filteredProfessors[i])
            } else {
                break;
            }
            endingIndex = i + 1;
        }

        console.log("-------------------", paginatedProfessors);
        // setIsLoading(false);

        return(paginatedProfessors);

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
                <bs.Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </bs.Spinner>
            )
       } else {   
            if(!isLoadingProfessors){
                console.log("hellloooooooooooooooooooooo")
                console.log(professorsForCourse)
                return(
                    <bs.Container style={{paddingTop: "2rem"}} fluid>
                        <Table 
                            professors={getProfessors()}
                            refreshProfessors={fetchData}
                            getRatings={props.getRatings}
                            courseid={course.id}
                            getImg={getImg}
                            createRating={props.createRating} 
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
   

   if(!professor && !course){
       return(
        <bs.Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </bs.Spinner>
    )
   } else if (course){
       return(
            <bs.Container fluid style={{marginRight: "3rem", marginLeft: "3rem"}}>
                <bs.Row style={{paddingTop: "1rem"}}>
                    <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
                </bs.Row>
                <bs.Row style={{paddingTop: "3rem"}}>
                    <bs.Col sm="1">
                    </bs.Col>
                    <bs.Col md="7">
                        <bs.Row>
                            <bs.Col style={{padding: "0"}}>
                                <h2>{course.name}</h2>
                                <h3>{course.code}</h3>
                            </bs.Col>
                            <bs.Col>
                                
                            </bs.Col>
                        </bs.Row>
                        <bs.Row>
                            <h5>{ course.description }</h5>
                        </bs.Row>
                        <bs.Row>
                            <bs.Badge className="badges" variant="danger">Hard Tests</bs.Badge>{' '}
                            <bs.Badge className="badges" variant="danger">Fast Lectures</bs.Badge>{' '}
                            <bs.Badge className="badges" variant="success">Funny</bs.Badge>{' '}


                        </bs.Row>
                    
                    
                        
                    </bs.Col>
                    <bs.Col md="4">
                        <bs.Row>
                            
                        <h4>Score: {course.score}</h4>

                        </bs.Row>
                        <bs.Row style={{marginTop: "10px"}}>
                            
                            <h5>{getRanking()[0]} in <Link to={`/schools/${course.department.school.id}/${course.department.id}/${match.params.type}`}>{ course.department.name}</Link>{"\n"}</h5> 
                        </bs.Row>
                        <bs.Row>
                            <h5>{getRanking()[1]} in <Link to={`/schools/${course.department.school.id}/all/${match.params.type}`}>{ course.department.school.name}</Link></h5>

                        </bs.Row>
                        <bs.Row>
                            <h5>{getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h5>

                        </bs.Row>
                    </bs.Col>
                    
                </bs.Row>

                <bs.Row>
                    <bs.Container fluid style={{marginRight: "10rem", marginLeft: "10rem"}}>
                        <bs.Row style={{paddingTop: "5em"}}>
                            <bs.Col md="4">

                                    <DataPieChart data={initPieData()}/>

                                    
                            </bs.Col>
                            <bs.Col md="6" style={{marginRight: "auto", marginLeft: "0", textAlign: "center"}}>
                                <h3>Score for {course.code}</h3><h6>(past 6 months)</h6>
                                <DataLineChart data={initChartData()}/>
                            </bs.Col>
                        
                        </bs.Row>
                    </bs.Container>
                </bs.Row>
                

                
                

                <bs.Row style={{marginTop: "5em", marginBottom: "3em"}}>
                    <bs.Col md="1"></bs.Col>
                    <bs.Col md="10">
                        <bs.Tabs defaultActiveKey="professors" id="controlled-tab-example">
                        <bs.Tab eventKey="professors" title="Professors" style={{paddingTop: "3em"}}>
                                <CreateModalClass />  
                                <bs.Container style={{ margin: "20px 0 20px 0"}}>
                                    <bs.Col md="6">
                                        <DataLineChart data={dataProfessors}/>
                                    </bs.Col>
                                    <bs.Col md="2">
                                        {/* <DataPieChart /> */}
                                    </bs.Col>
                                </bs.Container>                              
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
                                <h3 style={{paddingTop:"2rem"}}>Picutres</h3>
                                <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{paddingTop: "5em"}}>
                                    <bs.Row>
                                        <bs.Col lg="4">
                                            <img src={img1} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col lg="4" >
                                            <img src={img2} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col lg="4">
                                            <img src={img3} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                    </bs.Row>
                                    <bs.Row style={{paddingTop: "2em"}}>
                                        <bs.Col>
                                            <img src={img4} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            <img src={img5} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            <img src={img6} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                    </bs.Row>
                                    <bs.Row style={{paddingTop: "2em"}}>
                                        <bs.Col>
                                            <img src={img7} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                        </bs.Col>
                                        <bs.Col>
                                            
                                        </bs.Col>
                                        <bs.Col>
                                            
                                        </bs.Col>
                                    </bs.Row>
                                </bs.Container>
                            </bs.Tab>
                        </bs.Tabs>
                    </bs.Col>
                    <bs.Col md="1"></bs.Col>
                </bs.Row>
            </bs.Container>
            
       );
   }
   else{
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
                        
                        <h5>{getRanking()[0]} in <Link to={`/schools/${professor.department.school.id}/${professor.department.id}/${match.params.type}`}>{ professor.department.name}</Link>{"\n"}</h5> 
                    </bs.Row>
                    <bs.Row>
                        <h5>{getRanking()[1]} in <Link to={`/schools/${professor.department.school.id}/all/${match.params.type}`}>{professor.department.school.name}</Link>{"\n"}</h5>

                    </bs.Row>
                    <bs.Row>
                    <h5>{getRanking()[2]} in <Link to={`/schools/all/all/${match.params.type}`}>All {match.params.type}</Link></h5>

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
                            <bs.Container fluid className="min-vh-100 d-flex flex-column" style={{paddingTop: "3em"}}>
                                <bs.Row>
                                    <bs.Col lg="4">
                                        <img src={img1} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col lg="4">
                                        <img src={img2} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col lg="4">
                                        <img src={img3} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                </bs.Row>
                                <bs.Row style={{paddingTop: "2em"}}>
                                    <bs.Col>
                                        <img src={img4} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        <img src={img5} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        <img src={img6} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                </bs.Row>
                                <bs.Row style={{paddingTop: "2em"}}>
                                    <bs.Col>
                                        <img src={img7} height="200em" alt="not found" style={{boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)"}}/>
                                    </bs.Col>
                                    <bs.Col>
                                        
                                    </bs.Col>
                                    <bs.Col>
                                        
                                    </bs.Col>
                                </bs.Row>
                            </bs.Container>
                        </bs.Tab>
                    </bs.Tabs>
                </bs.Col>
                <bs.Col md="1"></bs.Col>
            </bs.Row>
        </bs.Container>
    )
   }
    

}

export default Detail;