import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { listSchools} from '../../graphql/queries';
import { API } from 'aws-amplify';

function SelectCollege() {
    const [colleges, setColleges] = useState();
    const [selected, setSelected] = useState();
    const match = useRouteMatch("/survey/major/:sid")
    const history = useHistory();

    useEffect(() => {
        fetchColleges();
    }, [])

    async function fetchColleges() {
        const apiData = await API.graphql({ query: listSchools });
        console.log(apiData.data.listSchools.items)
        setColleges(apiData.data.listSchools.items)
    }
    const handleClick = () => {
        if(selected){
            history.push(`/survey/major/${selected}`)
        }
    }

    return (
        <div>
            <div>
                    <h2>Major Survey</h2>
                    <p>What college is your major in?</p>
                    <Form >
                        {
                            colleges ?
                                <Form.Group 
                                    controlId="exampleForm.ControlDropdown1" 
                                    onChange={e => setSelected(e.target.value)}
                                >
                                    <Form.Label className="my-1 mr-2" >
                                        Choose a College
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        {
                                            colleges.map((college) => {
                                                return(
                                                    <option value={college.id} key={college.id}>{college.name}</option>
                                                )
                                            })
                                        }
                        
                                    </Form.Control>
                                </Form.Group>
                                :
                                <></>
                        }
                    </Form>

                    <button onClick={handleClick}>Next</button>
                    
                </div>
        </div>
    )
}

export default SelectCollege
