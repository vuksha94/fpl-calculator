import React from 'react';
import { PlayerTable } from './PlayerTable';
import { Search } from './Search';

export interface Player {
    id: number;
    first_name: string;
    last_name: string;
    web_name: string
    goals_scored: number;
    assists: number;
    minutes: number;
    team_code: number;
}

interface StateType {
    players: Player[];
    allPlayers: Player[];
    searchValue: string;
}



export class FPLSearch extends React.Component<Readonly<{}>, StateType> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            allPlayers: [],
            players: [],
            searchValue: ""
        };

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
    }

    private onSearchInputChange(value: string) {
        this.setState(Object.assign({ ...this.state }, {
            searchValue: value
        }));
    }
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate(prevProps: Readonly<{}>, prevState: StateType) {
        console.log(prevState);
        console.log(this.state)
        if (this.state.searchValue !== prevState.searchValue) {
            this.filterData(this.state.searchValue);
        }
    }
    private getData() {
        const data = require('../mock-data/bootstrap-static.json');
        const players = data.elements;
        this.setAllPlayersState(players);
        this.setPlayersState(players);
        /*api('bootstrap-static/', 'get')
            .then(res => {
                if (res.status === 'success') {
                    const players = res.data.elements;
                    this.setAllPlayersState(players);
                    this.setPlayersState(players);
                }
            })*/
        /*this.setAllPlayersState(PLAYERS);
        this.setPlayersState(PLAYERS);*/
    }
    private filterData(filterValue: string) {
        filterValue = filterValue.toLowerCase();
        const filteredPlayers = this.state.allPlayers.filter(p => {
            return p.id.toString().toLowerCase() === filterValue;
            //return p.id.toString().toLowerCase().indexOf(filterValue) > -1
        });
        console.log(filteredPlayers)
        this.setPlayersState(filteredPlayers);
    }
    private setPlayersState(players: Player[]) {
        this.setState(state => Object.assign({ ...state }, {
            players
        }))
    }
    private setAllPlayersState(allPlayers: Player[]) {
        this.setState(state => Object.assign({ ...state }, {
            allPlayers
        }))
        console.log(allPlayers)
    }
    render() {
        return (
            <div className="container-fluid fpl-search">
                <Search value={this.state.searchValue} onInputChange={this.onSearchInputChange} />
                <PlayerTable players={this.state.players} />
            </div>
        )
    }
}
