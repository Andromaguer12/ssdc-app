import { TournamentReducerInitialState } from "@/redux/reducers/tournament/actions";
import { emptyUserInitialState } from "../users/emptyInitialState";
import { TablePlayers, TournamentInterface } from "./types";


export const emptyTablePlayerInitialState: TablePlayers = {
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
    difference: 0,
    draw: 0,
    won: 0,
    lost: 0,
    form: [],
    sanction: null
}

export const emptyTournamentinitialState: TournamentReducerInitialState = {
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
    game: "Domino"
}