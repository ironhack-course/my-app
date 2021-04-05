import React from 'react';

type OnMouseEnter = (index: number) => void;

export default function cell(color = 'white', i: number, onMouseEnter: OnMouseEnter): React.ReactElement {
    return (<div
        className='grid-div'
        style={{ backgroundColor: color}}
        onMouseDown={() => onMouseEnter(i)}
        onMouseEnter={() => onMouseEnter(i)}
        key={i} id={`${i}`}
    ></div>)
}
