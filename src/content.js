// import React, { useState, useEffect } from 'react';
// import * as bs from 'react-bootstrap'
// import './App.css';
// import { listProfessors } from './graphql/queries';
// import { createProfessor as createProfessorMutation, deleteProfessor as deleteProfessorMutation } from './graphql/mutations';
// import { API, container, Storage } from 'aws-amplify'
// import CreateModal from './createmodal'
// import ContentCard from './contentcard'

// const initialFormState = { name: '', title: 'Professor', school: 'Business', department: 'Accounting' }
// const NUM_COLUMNS = 4

// function Content() {
//   const [professors, setProfessors] = useState([]);
//   const [formData, setFormData] = useState(initialFormState);
//   // const [queryVariables, setQueryVariables] = useState('');
//   // const [queryVariablesDept, setQueryVariablesDept] = useState('');

//   useEffect(() => {
//     console.log("fetching")
//     fetchProfessors();
//   }, []);

//   // useEffect(() => {
//   //   console.log("fetching new")
//   //   fetchFilteredProfessors();
//   // }, [queryVariables]);

//   // useEffect(() => {
//   //   console.log("fetching new")
//   //   fetchProfessorsbyDepartment();
//   // }, [queryVariablesDept]);

//   async function onChange(e) {
//     if (!e.target.files[0]) return
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file.name });
//     await Storage.put(file.name, file);
//     fetchProfessors();
//   }

//   // async function fetchProfessorsbyDepartment() {
//   //   console.log("{ query: listProfessors, variables: { filter: {department: { eq: " + queryVariablesDept + " }}} } ")
//   //   const apiData = await API.graphql({ query: listProfessors, variables: { filter: {department: { eq: queryVariablesDept }}} });
//   //   const professorsFromAPI = apiData.data.listProfessors.items;
//   //   await Promise.all(professorsFromAPI.map(async professor => {
//   //     console.log("These are my" + professor.name)
//   //     if (professor.image) {
//   //       const image = await Storage.get(professor.image);
//   //       professor.image = image;
//   //     }
//   //     return professor;
//   //   }))
//   //   setProfessors(apiData.data.listProfessors.items);
//   // }


//   // async function fetchFilteredProfessors() {
//   //   console.log("{ query: listProfessors, variables: { filter: {name: { contains: " + queryVariables + " }}} } ")
//   //   const apiData = await API.graphql({ query: listProfessors, variables: { filter: {name: { contains: queryVariables }}} });
//   //   const professorsFromAPI = apiData.data.listProfessors.items;
//   //   await Promise.all(professorsFromAPI.map(async professor => {
//   //     console.log("These are my" + professor.name)
//   //     if (professor.image) {
//   //       const image = await Storage.get(professor.image);
//   //       professor.image = image;
//   //     }
//   //     return professor;
//   //   }))
//   //   setProfessors(apiData.data.listProfessors.items);
//   // }
  
//   //{filter: {name: {contains: "ea"}}}
//   async function fetchProfessors() {
//     // console.log("fetch with " + queryVariables)
//     const apiData = await API.graphql({ query: listProfessors });
//     const professorsFromAPI = apiData.data.listProfessors.items;
//     await Promise.all(professorsFromAPI.map(async professor => {
//       console.log("These are my" + professor.name)
//       if (professor.image) {
//         const image = await Storage.get(professor.image);
//         professor.image = image;
//       }
//       return professor;
//     }))
//     setProfessors(apiData.data.listProfessors.items);
//   }



//   async function createProfessor() {
//     if (!formData.name || !formData.title) return;
//     await API.graphql({ query: createProfessorMutation, variables: { input: formData } });
//     if (formData.image) {
//       const image = await Storage.get(formData.image);
//       formData.image = image;
//     }
//     setProfessors([ ...professors, formData ]);
//     setFormData(initialFormState);
//   }



//   async function deleteProfessor({ id }) {
//     const newProfessorsArray = professors.filter(professor => professor.id !== id);
//     setProfessors(newProfessorsArray);
//     await API.graphql({ query: deleteProfessorMutation, variables: { input: { id } }});
//   }


//   const rows = []
//   for (let i = 0; i < professors.length; i += NUM_COLUMNS) {
//       rows.push(professors.slice(i, i + NUM_COLUMNS))
//   }

// //   console.log(rows)
// //() => setQueryVariables({ name: { contains: "Mark" } })

//   return (
//     <bs.Container style={{paddingTop: "5rem"}}>
//         <bs.Row style={{textAlign: "left"}}>
//             <bs.Col md="6">
//                 <bs.Row>
//                   <h1 >BYU Professors</h1>
//                   <CreateModal 
//                       professors={professors}
//                       setProfessors={setProfessors}
//                   />
//                 </bs.Row>
//             </bs.Col>

//             <bs.Col md="6" style={{textAlign: "right", marginTop: ".7rem"}}>
//                 <bs.Row>
//                 <bs.Dropdown>
                    
//                     <bs.Dropdown.Toggle variant="success" id="dropdown-basic">
//                         Search by Department
//                     </bs.Dropdown.Toggle>

//                     <bs.Dropdown.Menu>
//                         {/* <bs.Dropdown.Item href="#" onClick={() => setQueryVariablesDept("Plant & Wildlife Sciences")}>Information Systems</bs.Dropdown.Item>
//                         <bs.Dropdown.Item href="#" onClick={() => setQueryVariablesDept("Strategy")}>Another action</bs.Dropdown.Item>
//                         <bs.Dropdown.Item href="#" onClick={() => setQueryVariablesDept("Physiology & Developmental Biology")}>Something else</bs.Dropdown.Item> */}
//                     </bs.Dropdown.Menu>
//                 </bs.Dropdown>

//                   {/* <bs.Form style={{paddingLeft: "1rem"}}>
//                     <bs.Form.Group controlId="exampleForm.ControlInput1" onChange={e => setQueryVariables(e.target.value)}>
             
//                         <bs.Form.Control type="text" placeholder="Search for a Professor" />
//                     </bs.Form.Group>
//                   </bs.Form> */}

//                 </bs.Row>
                
//             </bs.Col>

//         </bs.Row>
//         <bs.Row>
            
//         </bs.Row>
//         <bs.Row>
//             {
//                 rows.map((row, row_index) => (
//                 <bs.Row key={row_index} style={{paddingBottom: "5rem"}}>
//                     {row.map(professor => (
//                     <bs.Col key={professor.name || professor.title} md="3">
//                       <ContentCard professor={professor} />
//                     </bs.Col>
//                     ))}
//                 </bs.Row>
//                 ))
//             }
//         </bs.Row>
//     </bs.Container>
//   );
// }

// export default Content;