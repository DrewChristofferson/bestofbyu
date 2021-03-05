import React, { useState, useEffect } from 'react';
import * as bs from 'react-bootstrap'

function SearchBar(props) {
    return(
        <bs.Form >
            <bs.Form.Group className="searchBar" controlId="exampleForm.ControlInput1" >
                <bs.Form.Control type="text" placeholder="Search" onChange={(e) => props.handleChangeSearch(e.currentTarget.value)}/>
            </bs.Form.Group>
        </bs.Form>
    )
}

export default SearchBar;