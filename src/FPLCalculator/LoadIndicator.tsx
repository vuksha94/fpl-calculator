import React from 'react';

interface PropsType {
    fullness: number;
}

export function LoadIndicator(props: PropsType) {
    return (
        <div id="indicator-div">
            <div id="indicator-filled-div" style={{ width: props.fullness + '%' }}></div>
            <div id="text-indicator">{props.fullness}%</div>
        </div>
    )
}