import React, { useState, useEffect } from 'react'
import {listProfessors} from '../../graphql/queries';
import { API } from 'aws-amplify'
import Form from "react-bootstrap/Form"


function GEProfessors(props) {
    const [professors, setProfessors] = useState({})
    let tempProfessors = [];

    useEffect(() => {
        fetchProfessors();
    }, [])

    async function fetchProfessors(nextToken) {
        let apiData;
        if(nextToken){
            apiData = await API.graphql({ query: listProfessors, variables: {limit: 5000, nextToken: nextToken}});
        } else {
            apiData = await API.graphql({ query: listProfessors, variables: {limit: 5000}});
        }
        tempProfessors = [...tempProfessors, ...apiData.data.listProfessors.items]
        tempProfessors.sort((a, b) => (a.name > b.name) ? 1 : -1 )
        setProfessors(tempProfessors)
        if(apiData.data.listProfessors.nextToken){
            fetchProfessors(apiData.data.listProfessors.nextToken)
        } 
        
    }


    return (
        <div>
            Rate the professors
            {
                Object.entries(props.ratingCourses).map(([key, value]) => { 
                    return(
                        <div>
                        <Form >
                        {
                            professors[0] ?
                                <Form.Group 
                                    controlId="exampleForm.ControlDropdown1" 
                                    // onChange={e => setSelected({...selected, [key]: e.target.value})}
                                >
                                    <Form.Label className="my-1 mr-2" >
                                    What professor did you have for {value.split('*')[1]}?
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        {
                                            professors.map((professor) => {
                                                return(
                                                    <option value={professor.id} key={professor.id}>{professor.name}</option>
                                                )
                                            })
                                        }
                        
                                    </Form.Control>
                                </Form.Group>
                                :
                                <></>
                            }
                        </Form>
                        </div>
                    )
                    
                })
            }
            <button>Finish</button>
        </div>
    )
}

export default GEProfessors
