import React from 'react';

interface Props {
    value: string;
    placeholder: string;
    onInputChange: (value: string) => void;
}
export function Search(props: Props) {
    return (
            <input type="text"
                value={props.value}
                placeholder={props.placeholder}
                onChange={(event) => props.onInputChange(event.target.value)} />
    )

}