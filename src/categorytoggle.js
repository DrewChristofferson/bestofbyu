import React from 'react'
import * as bs from 'react-bootstrap'

function CategoryToggle (props) {
    return(
        <bs.ButtonGroup toggle>
            {(props.CATEGORIES).map((category, index) => (
            <bs.ToggleButton
                key={index}
                type="radio"
                variant="secondary"
                name="category"
                value={category.value}
                checked={props.categoryValue === category.value}
                onChange={(e) => props.handleChangeToggle(e.currentTarget.value)}
            >
                {category.name}
            </bs.ToggleButton>
            ))}
        </bs.ButtonGroup>
    )
}

export default CategoryToggle;