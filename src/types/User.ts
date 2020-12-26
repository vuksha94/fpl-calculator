import { Leagues } from "./Leagues";

export class User {
    id?: number;
    name?: string;
    player_first_name?: string;
    player_last_name?: string;
    leagues?: Leagues

    getLeagues() {
        return this.leagues;
    }
}