import React, { useEffect, useState } from 'react'
import * as bs from 'react-bootstrap'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { getProfessor, listProfessors } from './graphql/queries'
import { API } from 'aws-amplify'

import catan from './images/catan.jpg'

function Detail() {
   const match = useRouteMatch("/schools/:sid/:did/:type/:oid")
   let history = useHistory();
   const [professor, setProfessor] = useState();

   useEffect(() => {
       console.log("fetching")
       fetchData();
     }, []);

   async function fetchData() {
       try{ 
       const apiData = await API.graphql({ query: getProfessor, variables: { id: match.params.oid }  });
       setProfessor(apiData.data.getProfessor)
       console.log(apiData)
       } catch (e) {
           console.log('Error: ' + e)
           console.log(e)
       }
   }
   if(!professor){
       console.log("hello",professor)
       return(
        <bs.Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </bs.Spinner>
    )
   }
   else{
       console.log("bye", professor)
    return(
        <bs.Container>
            <bs.Row style={{paddingTop: "1rem"}}>
                <bs.Button onClick={() => history.goBack()}>Go Back</bs.Button>
            </bs.Row>
            <bs.Row style={{paddingTop: "3rem"}}>
                <bs.Col sm="2">
                    <img className="profile" alt={professor.name} src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" />
                </bs.Col>
                <bs.Col md="6" style={{paddingLeft: "5rem"}}>
                    <bs.Row>
                        <bs.Col>
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
                        
                        <h5>2nd in <Link to={`schools/${professor.departmentID}/professors`}>{ professor.department.name}</Link>{"\n"}</h5> 
                    </bs.Row>
                    <bs.Row>
                        <h5>4th in <Link to="/table1">{ professor.department.school.name}</Link></h5>

                    </bs.Row>
                    <bs.Row>
                        <h5>9th in <Link to="/table1">All professors</Link></h5>

                    </bs.Row>
                </bs.Col>
                
            </bs.Row>

            <bs.Row style={{marginTop: "3rem"}}>
                <bs.Col>
                    <bs.Tabs defaultActiveKey="home" id="controlled-tab-example">
                        <bs.Tab eventKey="home" title="About">
                            <strong>Description: </strong>
                            
                    
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                        <bs.Tab eventKey="profile" title="Discussion">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                        <bs.Tab eventKey="contact" title="Pictures" >
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac tellus elit. Ut quis ultrices turpis, ac mattis arcu. </p>
                        </bs.Tab>
                    </bs.Tabs>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
   }
    

}

export default Detail