import React from 'react';

interface Props {
    value: string;
    onInputChange: (value: string) => void;
}
export function Search(props: Props) {
    return (
        <div className="row">
            <input type="text"
                value={props.value}
                placeholder="Search..."
                onChange={(event) => props.onInputChange(event.target.value)} />
        </div>
    )

}