import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    progress[value] {
        width: ${props => props.width};
        appearance: none;
        ::-webkit-progress-bar {
            height 10px;
            border-radius 20px;
            background-color: #eee;
            text-align: center;
        }

        ::-webkit-progress-value {
            height: 10px;
            border-radius;
            background-color: ${props => props.color};
        }
    }
`

function ProgressBar(props) {
    const { value, max, color, width } = props;
    return (
        <Container color={color} width={width}>
            <progress value={value} max={max} />
        </Container>
    )
}

export default ProgressBar

