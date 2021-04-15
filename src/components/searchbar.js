import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'
import { useRouteMatch } from 'react-router-dom'


function SearchBar(props) {
    const match = useRouteMatch("/schools/:sid/:did/:type")

    return(
        <div className="headerSearchBar">
            <bs.Form >
                <bs.Form.Group className="searchBar" controlId="exampleForm.ControlInput1" >
                    <bs.Form.Control type="text" placeholder={`Search ${match.params.type}`}onChange={(e) => props.handleChangeSearch(e.currentTarget.value)}/>
                </bs.Form.Group>
            </bs.Form>
        </div>
        
    )
}

export default SearchBar;