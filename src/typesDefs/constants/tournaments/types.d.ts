import { UserReducerInitialState } from "@/redux/reducers/user/actions";
import { UserInterface } from "../users/types";

type TournamentFormat = "individual" | "pairs" | "team";
type TournamentState = "active" | "inactive" | "paused";
type TournamentGame = "domino" | "ajedrez"

export type TablePlayers = {
    position: number,
    team: UserReducerInitialState[],
    playedRounds: number,
    form: Form[],
    won: number,
    draw: number,
    lost: number,
    points: number,
    difference: number,
    sanction: SanctionType,
}

export type ResultsFormat = {
    winner: TablePlayers,
    loser: TablePlayers,
    match: number,
    result: number[]
}

export type PairInterface = {
    pair: string[],
    table: string,
}

export type IndividualInterface = {
    player: string,
    table: string,
}

export type TableObjectInterface = {
    tableId: string,
    table: string[],
    pair1Color: string,
    pair2Color: string,
    currentTableRound: number,
}

export type PairsTableInterface = {
    tables: TableObjectInterface[],
    pairs: PairInterface[]
}

export type IndividualTableInterface = {
    tables: TableObjectInterface[],
    individual: IndividualInterface[]
}

export interface TournamentInterface {
    id?: string,
    softDeleted?: boolean,
    name: string,
    format: TournamentFormat,
    startDate: Date | number,
    endDate?: Date | number,
    currentGlobalRound: number,
    allPlayers: string[],
    status: TournamentState,
    customRounds: number,
    winner: UserInterface | null,
    game: TournamentGame,
    tables: IndividualTableInterface | PairsTableInterface,
    // playerResults: 
}

