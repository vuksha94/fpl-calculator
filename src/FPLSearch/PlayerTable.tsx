import React from 'react';
import { Player } from './FPLSearch';
import { PlayerRow } from './PlayerRow';



interface Props {
    players: Player[];
}
export function PlayerTable(props: Props) {
    function makeRows(players: Player[]) {
        return (
            players.map(player => <PlayerRow key={player.id} playerInfo={player} />)
        )
    }
    return (
        <div className="row">
            <div className="player-table">
                {makeRows(props.players)}
            </div>
        </div>
    )

}