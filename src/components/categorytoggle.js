import React from 'react'
import * as bs from 'react-bootstrap'
import styled from 'styled-components'

const StyledButton = styled(bs.ButtonGroup)`
    z-index: 0;
`

function CategoryToggle (props) {
    return(
        <StyledButton toggle>
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
        </StyledButton>
    )
}

export default CategoryToggle;