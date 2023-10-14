import { UserReducerInitialState } from "@/redux/reducers/user/actions";
import { UserInterface } from "../users/types";

type TournamentFormat = "individual" | "pairs" | "team";
type TournamentGame = "Domino" | "Ajedrez"
type Form = "L" | "W" | "D";
type SanctionType = "Pase agachado" | "Cabra" | null;

export type TablePlayers = {
    position: number,
    team: UserReducerInitialState[],
    playedRounds: number,
    form: Form[],
    won: number,
    draw: number,
    lost: number,
    points: number,
    sanction: SanctionType,
}

export interface TournamentInterface {
    name: string,
    rules: string,
    format: TournamentFormat,
    startDate: string,
    endDate: string,
    currentRound: number,
    winner: UserInterface | null,
    table: TablePlayers[],
    game: TournamentGame,
}

