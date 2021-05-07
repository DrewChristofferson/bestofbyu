import React, { useState, useEffect } from 'react'
import { useRouteMatch, useHistory  } from 'react-router-dom'
import Form from "react-bootstrap/Form"
import { listDepartments} from '../../graphql/queries';
import { API } from 'aws-amplify';

function SelectDepartment() {
    const [departments, setDepartments] = useState();
    const [selected, setSelected] = useState();
    const match = useRouteMatch("/survey/major/:sid")
    const history = useHistory();

    useEffect(() => {
        fetchDepartments();
    }, [])

    async function fetchDepartments() {
        const apiData = await API.graphql({ query: listDepartments, variables: {filter: { schoolID: {eq: match.params.sid}} }});
        console.log(apiData.data.listDepartments.items)
        setDepartments(apiData.data.listDepartments.items)
    }

    const handleClick = () => {
        if(selected){
            history.push(`${match.url}/${selected}/courses`)
        }
    }

    return (
        <div>
                    <h2>Major Survey</h2>
                    <p>What department is your major in?</p>
                    <Form >
                        {
                            departments ?
                                <Form.Group controlId="exampleForm.ControlDropdown1" onChange={e => setSelected(e.target.value)}>
                                    <Form.Label className="my-1 mr-2" >
                                        Choose a Department
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="my-1 mr-sm-2"
                                        custom
                                    >
                                        {
                                            departments.map((department) => {
                                                return(
                                                    <option value={department.id} key={department.id}>{department.name}</option>
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
    )
}

export default SelectDepartment
