import React from 'react';

interface Props {
    name: string;
    value: string;
    options: string[];
    onFilterChange: (value: string) => void;
}
export function FilterField(props: Props) {
    return (
        <div className="row">
            <select
                value={props.value}
                onChange={(event) => props.onFilterChange(event.target.value)}>
                {props.options.map(row => <option value={row}>{row}</option>)}
            </select>
        </div>
    )

}