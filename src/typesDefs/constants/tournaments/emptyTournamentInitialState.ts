import { emptyUserInitialState } from "../users/emptyInitialState";
import { TournamentInterface } from "./types";


export const emptyTablePlayerInitialState = {
    team: [{
        ...emptyUserInitialState,
        loadingUser: false,
        error: '',
        uid: '',
        id: '',
        accessToken: ''
    }],
    points: 0,
    position: 0,
    playedRounds: 0,
    draw: 0,
    won: 0,
    lost: 0,
    form: [],
    sanction: null
}

export const emptyTournamentinitialState: TournamentInterface = {
    name: "",
    rules: "",
    format: "individual",
    startDate: "",
    endDate: "",
    currentRound: 1,
    winner: null,
    table: [{
        results: [{
            winner: emptyTablePlayerInitialState,
            loser: emptyTablePlayerInitialState,
            match: 0,
            result: [0]
        }],
        standings: [emptyTablePlayerInitialState]
    }],
    game: "Ajedrez"
}