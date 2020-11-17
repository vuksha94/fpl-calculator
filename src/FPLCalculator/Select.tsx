import React from 'react';
import { Option } from './FPLCalculator';

interface PropsType {
    options: Option[];
    defaultText: string;
    value: number;
    onSelectChange: (value: string) => void;
    description: string;
}
export function Select(props: PropsType) {
    return (
        <div className="form-group">
            <label>{props.description}:</label>
            <select className="form-control"
                onChange={(e) => props.onSelectChange(e.target.value)}
                value={props.value}>
                <option value="">{props.defaultText}</option>
                {props.options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
            </select>
        </div>
    )
}