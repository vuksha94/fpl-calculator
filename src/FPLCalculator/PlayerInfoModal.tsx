import React from 'react';
import { Player } from './FPLCalculator';

interface PropsType {
    player: Player | undefined;

}

export function PlayerInfoModal(props: PropsType) {

    return (
        <div id="playerInfoModal" className="modal fade" role="dialog">
            <div className="modal-dialog">

                <div className="modal-content">
                    <div className="modal-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Goals</th>
                                    <th>Assists</th>
                                    <th>Minutes</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>{props.player?.first_name + ' ' + props.player?.second_name}</th>
                                    <th>{props.player?.goals_scored}</th>
                                    <th>{props.player?.assists}</th>
                                    <th>{props.player?.minutes}</th>
                                    <th>{props.player?.percentageXI}%</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>

            </div>
        </div>
    )
}