import React from 'react';
import { setNumberOfManagers } from '../redux/Manager/ManagerActions';
import { Dispatch } from '../redux/types';
import { Option } from './FPLCalculator';

import { connect } from 'react-redux';

interface PropsType {
    options: Option[];
    defaultText: string;
    value: number;
    onSelectChange: (value: string) => void;
    description: string;
    dispatch: Dispatch;
}
const Select = (props: PropsType) => {
    return (
        <div className="form-group">
            <label>{props.description}:</label>
            <select className="form-control"
                onChange={(e) => {
                    props.onSelectChange(e.target.value);
                    props.dispatch(setNumberOfManagers(Number(e.target.value)))
                }}
                value={props.value}>
                <option value="">{props.defaultText}</option>
                {props.options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
            </select>
        </div>
    )
}

export default connect()(Select);