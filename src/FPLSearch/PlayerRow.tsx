import React from 'react';
import { Player } from './FPLSearch';

interface Props {
    playerInfo: Player
}

export function PlayerRow(props: Props) {
    const playerInfo = props.playerInfo;
    return (
        <div className="player-row">
            <div>
                <div>{playerInfo.web_name}</div>
            </div>
            <div className="player-row-stats">
                <div>{playerInfo.goals_scored} goals</div>
                <div>{playerInfo.assists} assists</div>
                <div>{playerInfo.minutes} minutes</div>
            </div>
        </div>
    )
}