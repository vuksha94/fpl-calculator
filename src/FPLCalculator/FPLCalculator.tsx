import React from 'react';
import api from '../api/api';
import { Select } from './Select';

import $ from 'jquery';
import { PlayerInfoModal } from './PlayerInfoModal';
import { Loader } from './Loader';

export interface PlayersAndGWInfo {
    players: Player[];
    currentGW: number;
}
export interface Option {
    value: number;
    text: string;
}
export interface Player {
    id: number;
    first_name: string;
    second_name: string;
    web_name: string
    goals_scored: number;
    assists: number;
    minutes: number;
    team_code: number;

    countXI?: number;
    countSub?: number;
    countCaptain?: number;
    percentageXI?: number;
    percentageSub?: number;
    percentageCaptain?: number;
}

export class Manager {
    entry: number
    constructor(entry: number) {
        this.entry = entry;
    }
}

export interface PlayersCountsInfo {
    playersXIIds?: number[];
    playersSUBIds?: number[];
    playersCaptainsIds?: number[];
}

interface StateType {
    allPlayersInfo: Player[];
    managers: Manager[];

    playersXICountMap: Map<number, number>;
    playersSubCountMap: Map<number, number>;
    playersCaptainCountMap: Map<number, number>;

    playersXIPercentageArray: Player[];
    playersSubPercentageArray: Player[];
    playersCaptainPercentageArray: Player[];

    loading: boolean;
    serverError: boolean;
    numberOfManagers: number;
    leagueCode: number;
    currentGW?: number;
    loadingFullness: number;
    playerInfoClicked?: Player;
    playersXISorted?: 'desc' | 'asc';
}



export class FPLCalculator extends React.Component<Readonly<{}>, StateType> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            allPlayersInfo: [],
            managers: [],
            playersXICountMap: new Map<number, number>(),
            playersSubCountMap: new Map<number, number>(),
            playersCaptainCountMap: new Map<number, number>(),
            playersXIPercentageArray: [],
            playersSubPercentageArray: [],
            playersCaptainPercentageArray: [],
            loading: false,
            serverError: false,
            numberOfManagers: 100,
            leagueCode: 64284,
            loadingFullness: 0
        };


    }

    componentDidMount() {
        // this.getData();
    }
    /*componentDidUpdate(prevProps: Readonly<{}>, prevState: StateType) {

    }*/

    private resetData() {
        this.setState(state => Object.assign({ ...state }, {
            managers: [],
            playersCountMap: new Map<number, number>(),
            playersPercentageArray: [],
            serverError: false,
            loadingFullness: 0
        }));
    }
    private getData() {
        this.resetData();
        console.log('getData()')
        this.setLoadingState(true);

        this.getAllPlayersAndGWInfo()
            .then(data => {
                console.log('getAllPlayersAndGWInfo response')
                this.setAllPlayersInfoInState(data!.players);
                this.setCurrentGWInState(data!.currentGW);
            });

        this.getListOfManagers()
            .then(managers => {
                this.setManagersInState(managers);
                console.log(managers);
                return this.getListOfPlayers(managers)
            })
            .then(playersCountsInfo => {
                this.setPlayersCountsInfoInMaps(playersCountsInfo);
                console.log(this.state.playersXICountMap);
                console.log(this.state.playersSubCountMap);
                console.log(this.state.playersCaptainCountMap);
                this.calculatePercentage();
                this.setLoadingState(false);
            })
        console.log('getData() end')
    }

    private calculatePercentage() {
        let playersXIPercentageArray: Player[] = [];
        let playersCaptainPercentageArray: Player[] = [];
        this.state.playersXICountMap.forEach((cnt, id) => {
            const numOfManagers = this.state.managers.length;
            let percentage = (cnt / numOfManagers) * 100;
            // percentage = Math.floor(percentage * 100) / 100; // na dve decimale
            percentage = Number(percentage.toFixed(2)); // na dve decimale
            const player = this.state.allPlayersInfo.find(p => p.id === id);
            player!.percentageXI = percentage;
            player!.countXI = cnt;
            playersXIPercentageArray = [...playersXIPercentageArray, player!];
        });
        const sortedXI = playersXIPercentageArray.sort((a, b) => b.percentageXI! - a.percentageXI!);
        this.setPlayersXISorted('desc');
        this.setPlayersXIPercentageArray(sortedXI);

        this.state.playersCaptainCountMap.forEach((cnt, id) => {
            const numOfManagers = this.state.managers.length;
            let percentage = (cnt / numOfManagers) * 100;
            // percentage = Math.floor(percentage * 100) / 100; // na dve decimale
            percentage = Number(percentage.toFixed(2)); // na dve decimale
            const player = this.state.allPlayersInfo.find(p => p.id === id);
            player!.percentageCaptain = percentage;
            player!.countCaptain = cnt;
            playersCaptainPercentageArray = [...playersCaptainPercentageArray, player!];
        });
        const sortedCaptains = playersCaptainPercentageArray.sort((a, b) => b.percentageCaptain! - a.percentageCaptain!);
        this.setPlayersCaptainPercentageArray(sortedCaptains);
    }



    private getAllPlayersAndGWInfo(): Promise<PlayersAndGWInfo | undefined> {
        return new Promise<PlayersAndGWInfo>(resolve => {
            api('bootstrap-static/', 'get')
                .then(res => {
                    if (res.status === 'success') {
                        const players = res.data.elements;
                        const currentGW = res.data.events.find((e: any) => e.is_current).id;
                        return resolve({
                            players,
                            currentGW
                        });
                    } else {
                        this.setServerError(true);
                    }
                })
        });

    }
    private async getListOfPlayers(managers: Manager[] | undefined): Promise<PlayersCountsInfo> {
        const currentGW = this.state.currentGW;
        //let playersCountsInfo: PlayersCountsInfo = {};
        let playersXIIds: number[] = [];
        let playersSUBIds: number[] = [];
        let playersCaptainsIds: number[] = [];
        console.log('managers start');
        return new Promise<PlayersCountsInfo>(resolve => {

            let requests: string[] = [];
            for (let idx in managers!) {
                const url = `/entry/${managers[idx].entry}/event/${currentGW}/picks/`;
                requests.push(url);
            }

            let promises = [];
            for (let i = 0; i < requests.length; ++i) {
                promises.push(api(requests[i], 'get'));
            }

            // when all promises are resolved resolve -> all manager's players for given gw are loaded
            Promise.all(promises)
                .then(allResponses => {
                    for (const res of allResponses) {
                        if (res.status === 'success') {
                            const picks = res.data.picks;
                            for (const idx in picks) {
                                const pick = picks[idx];
                                if (Number(idx) < 11) {
                                    playersXIIds = [...playersXIIds, pick.element];
                                } else {
                                    playersSUBIds = [...playersSUBIds, pick.element];
                                }
                                if (pick.is_captain) {
                                    playersCaptainsIds = [...playersCaptainsIds, pick.element];
                                }
                            }
                        } else {
                            this.setServerError(true);
                        }
                    }
                    resolve({
                        playersXIIds,
                        playersSUBIds,
                        playersCaptainsIds
                    });
                });
        })

    }




    private async getListOfManagers(): Promise<Manager[] | undefined> {
        const pages = Math.ceil(this.state.numberOfManagers / 50); // read exact num of pages
        const lastManagerOnPage = this.state.numberOfManagers % 50;
        const leagueId = this.state.leagueCode; // overall league id
        let managers: Manager[] = [];
        for (let pageNumber = 1; pageNumber <= pages; ++pageNumber) {
            const url = `leagues-classic/${leagueId}/standings/?page_standings=${pageNumber}`;
            const res = await api(url, 'get');
            if (res.status === 'success') {
                console.log(res.data)
                const standings = res.data.standings.results;
                for (let i = 1; i <= standings.length; i++) {
                    if (pages === pageNumber && lastManagerOnPage !== 0 && lastManagerOnPage === i - 1) break; // last page and last manager done -> exit the loop
                    const entry = standings[i - 1].entry
                    managers = [...managers, new Manager(entry)]
                }
                if (!res.data.standings.has_next) break;
            } else {
                return Promise.resolve([]);
            }
        }
        return Promise.resolve(managers);
    }



    private setPlayersXISorted(playersXISorted: 'desc' | 'asc') {
        this.setState(state => Object.assign({ ...state }, {
            playersXISorted
        }));
    }
    private setPlayersXIPercentageArray(playersXIPercentageArray: Player[]) {
        this.setState(state => Object.assign({ ...state }, {
            playersXIPercentageArray
        }));
    }
    private setPlayersCaptainPercentageArray(playersCaptainPercentageArray: Player[]) {
        this.setState(state => Object.assign({ ...state }, {
            playersCaptainPercentageArray
        }));
    }

    private makeMap(arrayOfIds: number[]) {
        const map = new Map<number, number>();
        for (const id of arrayOfIds) {
            if (map.has(id)) {
                const cnt = map.get(id);
                map.set(id, cnt! + 1);
            } else {
                map.set(id, 1);
            }
        }
        return map;
    }

    private setPlayersCountsInfoInMaps(playersCountsInfo: PlayersCountsInfo | undefined) {

        const playersXICountMap = this.makeMap(playersCountsInfo?.playersXIIds!);
        const playersSubCountMap = this.makeMap(playersCountsInfo?.playersSUBIds!);
        const playersCaptainCountMap = this.makeMap(playersCountsInfo?.playersCaptainsIds!);

        this.setPlayersXICountMap(playersXICountMap);
        this.setPlayersSubCountMap(playersSubCountMap);
        this.setPlayersCaptainCountMap(playersCaptainCountMap);

    }

    private setPlayersXICountMap(playersXICountMap: Map<number, number>) {
        this.setState(state => Object.assign({ ...state }, {
            playersXICountMap
        }));
    }
    private setPlayersSubCountMap(playersSubCountMap: Map<number, number>) {
        this.setState(state => Object.assign({ ...state }, {
            playersSubCountMap
        }));
    }
    private setPlayersCaptainCountMap(playersCaptainCountMap: Map<number, number>) {
        this.setState(state => Object.assign({ ...state }, {
            playersCaptainCountMap
        }));
    }

    private setLoadingState(loading: boolean) {
        this.setState(state => Object.assign({ ...state }, {
            loading
        }));
    }
    private setServerError(serverError: boolean) {
        this.setState(state => Object.assign({ ...state }, {
            serverError
        }));
    }

    private setAllPlayersInfoInState(allPlayersInfo: Player[] | undefined) {
        this.setState(state => Object.assign({ ...state }, {
            allPlayersInfo
        }));
    }

    private setManagersInState(managers: Manager[] | undefined) {
        this.setState(state => Object.assign({ ...state }, {
            managers
        }));
    }

    private setNumberOfManagersInState(numberOfManagers: number) {
        this.setState(state => Object.assign({ ...state }, {
            numberOfManagers
        }));
    }

    private setLeagueCodeInState(leagueCode: number) {
        this.setState(state => Object.assign({ ...state }, {
            leagueCode
        }));
    }

    private setCurrentGWInState(currentGW: number) {
        this.setState(state => Object.assign({ ...state }, {
            currentGW
        }));
    }

    private setLoadingFullnessInState(loadingFullness: number) {
        this.setState(state => Object.assign({ ...state }, {
            loadingFullness
        }));
    }
    private setPlayerInfoClickedInState(playerInfoClicked: Player) {
        this.setState(state => Object.assign({ ...state }, {
            playerInfoClicked
        }));
    }

    private playerRowClicked = (player: Player) => {
        this.setPlayerInfoClickedInState(player);
        ($('#playerInfoModal') as any).modal('show');
    }


    private printPlayerXIRow = (p: Player, idx: number, arr: Player[]) => {
        return (
            <tr key={p.id} onClick={() => this.playerRowClicked(p)}>
                <td>{idx + 1}.</td>
                <td>{p.web_name}</td>
                <td>{p.percentageXI}%</td>
                <td>{p.countXI}</td>
            </tr>
        );
    }
    private printPlayerCaptainRow = (p: Player, idx: number, arr: Player[]) => {
        return (
            <tr key={p.id} onClick={() => this.playerRowClicked(p)}>
                <td>{idx + 1}.</td>
                <td>{p.web_name}</td>
                <td>{p.percentageCaptain}%</td>
                <td>{p.countCaptain}</td>
            </tr>
        );
    }
    private printServerErrorMsg() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <span className="text-danger">Server error occured. Data may be invalid.</span>
                </div>
            </div>
        )

    }

    private toggleSortStartXI() {
        let sortedReverse = [];
        if (this.state.playersXISorted === 'desc') {
            sortedReverse = this.state.playersXIPercentageArray.sort((a: Player, b: Player) => {
                return a.percentageXI! - b.percentageXI!;
            });
            this.setPlayersXISorted('asc');
        } else {
            sortedReverse = this.state.playersXIPercentageArray.sort((a: Player, b: Player) => {
                return b.percentageXI! - a.percentageXI!;
            })
            this.setPlayersXISorted('desc');
        }

        this.setPlayersXIPercentageArray(sortedReverse);
    }

    private printPlayersPercentage() {
        console.log('server error: ' + this.state.serverError);
        if (this.state.playersXIPercentageArray.length) {
            return (
                <>

                    <div className="col-sm-6">
                        <table className="table table-bordered">
                            <thead>
                                <tr><th colSpan={4}>Starting XI</th></tr>
                                <tr>
                                    <th className="cursor-pointer" onClick={() => this.toggleSortStartXI()} scope="col">#</th>
                                    <th scope="col">Player</th>
                                    <th scope="col">Percentage</th>
                                    <th scope="col">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.playersXIPercentageArray.map(this.printPlayerXIRow)}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-sm-6">
                        <table className="table table-bordered">
                            <thead>
                                <tr><th colSpan={4}>Captains</th></tr>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Player</th>
                                    <th scope="col">Percentage</th>
                                    <th scope="col">CNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.playersCaptainPercentageArray.map(this.printPlayerCaptainRow)}
                            </tbody>
                        </table>
                    </div>
                </>
            )
        }
    }

    private printLoadingBar() {
        //return <LoadIndicator fullness={this.state.loadingFullness} />;
        return (
            <div className="col-sm-12 loader-col">
                <Loader />
            </div>
        )
    }


    private selectValueChanged = (numberOfManagers: string) => {
        this.setNumberOfManagersInState(Number(numberOfManagers));
    }

    private leagueCodeChanged = (leagueCode: string) => {
        this.setLeagueCodeInState(Number(leagueCode));
    }

    render() {
        const fromOptions: Option[] = [
            { value: 5, text: "TOP 5" },
            { value: 10, text: "TOP 10" },
            { value: 100, text: "TOP 100" },
            /*{ value: 500, text: "TOP 500" },
            { value: 1000, text: "TOP 1000" },
            { value: 10000, text: "TOP 10K" },*/
        ];
        const totalNumberOfManagers = this.state.managers.length;

        return (
            <div className="container-fluid">
                <div className="row">
                    <Select onSelectChange={this.selectValueChanged}
                        defaultText="Select" options={fromOptions}
                        value={this.state.numberOfManagers}
                        description="Sample" />
                </div>
                <div className="row">
                    <div className="form-group">
                        <label>League code:</label>

                        <input className="form-control" type="number"
                            value={this.state.leagueCode}
                            onChange={(e) => this.leagueCodeChanged(e.target.value)}
                            required />
                    </div>
                </div>
                <div className="row">
                    <button className="btn btn-info" disabled={this.state.loading} onClick={() => this.getData()}>Calculate percentage</button>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {!this.state.loading && !this.state.serverError && totalNumberOfManagers > 0 &&
                            <span className="text-bold ">
                                Total number of managers:{totalNumberOfManagers}
                            </span>
                        }
                    </div>
                </div>
                <>
                    {this.state.serverError && this.printServerErrorMsg()}
                </>
                <div className="row">

                    {!this.state.loading && this.printPlayersPercentage()}
                    {this.state.loading && this.printLoadingBar()}
                </div>

                <PlayerInfoModal player={this.state.playerInfoClicked} />

            </div>
        )
    }
}
