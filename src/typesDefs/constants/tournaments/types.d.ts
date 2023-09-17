import { UserInterface } from "../users/types";

type TournamentFormat = "individual" | "pairs" | "team";

type Form = "L" | "W" | "D";

type TablePlayers = {
    position: number,
    team: UserInterface[],
    playedRounds: number,
    form: Form[],
    won: number,
    draw: number,
    lost: number,
    poitns: number,
}

export interface TournamentInitialState {
    name: string,
    rules: string,
    format: TournamentFormat,
    startDate: string,
    endDate: string,
    currentRound: number,
    winner: UserInterface | null,
    table: TablePlayers[]
}

