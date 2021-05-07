import React from 'react'

function DifficultyRater(props) {

    const handleDifRating = (e, id, value) => {
        e.preventDefault();
        let tempRatings = {};
        for (const [key, value] of Object.entries(props.difRatings)) {
            tempRatings[key] = value;
        }

        if(tempRatings[id] === value){
            delete tempRatings[id];
        }else {
            tempRatings[id] = value;
        }

        props.updateDifRatings(tempRatings)
    }

    return (
        props.selected[props.id] ?
        <div>
            <button onClick={(e) => handleDifRating(e, props.id, 'one')} style={props.difRatings[props.id] === 'one' ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }}>1</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'two')} style={props.difRatings[props.id] === 'two' ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }}>2</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'three')} style={props.difRatings[props.id] === 'three' ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }}>3</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'four')} style={props.difRatings[props.id] === 'four' ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }}>4</button>
            <button onClick={(e) => handleDifRating(e, props.id, 'five')} style={props.difRatings[props.id] === 'five' ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }}>5</button>
        </div>
        :
        <></>
    )
}

export default DifficultyRater
