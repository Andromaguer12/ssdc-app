//import { TournamentReducerInitialState } from './actions';
import { TournamentInterface } from '@/typesDefs/constants/tournaments/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface TournamentReducerInitialState extends TournamentInterface {
    successCreated: boolean,
    error: string,
    loading: boolean,
    id: string,
    updateTournament: {
        loading: boolean,
        success: boolean,
        error: any | null
    }
}

const initialState: TournamentReducerInitialState = {
    name: "",
    rules: "",
    format: "individual",
    startDate: "",
    endDate: "",
    currentRound: 1,
    winner: null,
    table: [
        {
            position: 0,
            team: [],
            playedRounds: 0,
            form: [],
            sanction: null,
            won: 1,
            draw: 0,
            lost: 0,
            points: 0
        }
    ],
    successCreated: false,
    loading: false,
    error: '',
    game: 'Domino',
    id: '',
    updateTournament: {
        loading: false,
        success: false,
        error: null
    }
}

export const tournamentCreateFunction = createAsyncThunk(
    'tournaments/tournamentCreateFunction',
    async ({ context, tournamentData }: { context: any, tournamentData: TournamentInterface }) => {
        const { name, rules, format, startDate, endDate, currentRound, winner, table, game } = tournamentData;
        const tournamentCreated = await context.createTournament(
            name,
            rules,
            format,
            startDate,
            endDate,
            currentRound,
            winner,
            table,
            game
        );
        return tournamentCreated
    }
)

export const tournamentUpdateFunction = createAsyncThunk(
    'tournaments/tournamentUpdateFunction',
    async ({ context, payload }: { context: any, payload: TournamentReducerInitialState, tournament: TournamentReducerInitialState }) => {
        return context.updateTournament(payload);
    }
)


const tournamentSlice = createSlice({
    name: 'tournament',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(tournamentCreateFunction.pending, (state, action: any) => {
            state.loading = true;
        });
        builder.addCase(tournamentCreateFunction.fulfilled, (state, action) => {
            state.successCreated = true;
            state.loading = initialState.loading;
            state.error = initialState.error
        });
        builder.addCase(tournamentCreateFunction.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.error;
        });

        builder.addCase(tournamentUpdateFunction.pending, (state, action: any) => {
            state.updateTournament.loading = true;
            state.updateTournament.success = false;
            state.updateTournament.error = null;
        });
        builder.addCase(tournamentUpdateFunction.fulfilled, (state, action) => {
            state.updateTournament.loading = false;
            state.updateTournament.success = true;
            state.updateTournament.error = null;
        });
        builder.addCase(tournamentUpdateFunction.rejected, (state, action: any) => {
            state.updateTournament.loading = false;
            state.updateTournament.success = false;
            state.updateTournament.error = action.error || action.payload;
        });

    }
});


export const { } = tournamentSlice.actions
export default tournamentSlice.reducer;
