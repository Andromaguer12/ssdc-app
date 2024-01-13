import { UserReducerInitialState } from "@/redux/reducers/user/actions";
import { UserInterface } from "../users/types";

type TournamentFormat = "individual" | "pairs" | "team";
type TournamentState = "active" | "inactive" | "paused" | "finished";
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

export type ResultsByRoundInterface = {
    currentTableRound: number,
    pointsPerPlayer: {
        p1: number,
        p2: number,
        p3: number,
        p4: number
    },
    pointsPerPair :{
        pair1: number,
        pair2: number
    },
    effectivenessByPair: {
        pair1: number,
        pair2: number
    },
    effectivenessByPlayer: {
        p1: number,
        p2: number,
        p3: number,
        p4: number
    },
    roundWinner: number,
    finalWinner: number | null,
    tableMatchEnded: boolean
    sanctions: any[]
}

export type ResultsInterface = {
    [string]: {
        resultsByRound: ResultsByRoundInterface[],
        players: string[]
    }
}

export type StoredRoundDataInterface = {
    currentRoundId: number,
    tables: PairsTableInterface,
    results: ResultsInterface,
    storedDate: Date | number,
}

export interface TournamentInterface {
    id?: string,
    softDeleted?: boolean,
    name: string,
    format: TournamentFormat,
    startDate: Date | number,
    endDate?: Date | number | null,
    currentGlobalRound: number,
    allPlayers: string[],
    status: TournamentState,
    customRounds: number,
    winner: UserInterface | null,
    game: TournamentGame,
    tables: PairsTableInterface,
    results?: ResultsInterface | null,
    storedRounds?: StoredRoundDataInterface[]
}

