//import { TournamentReducerInitialState } from './actions';
import { TournamentInterface } from '@/typesDefs/constants/tournaments/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface TournamentReducerInitialState extends TournamentInterface {
    successCreated: boolean,
    error: string,
    loading: boolean,
    id?: string,
}

const initialState: TournamentReducerInitialState = {
    name: "",
    rules: "",
    format: "individual",
    startDate: "",
    endDate: "",
    currentRound: 1,
    winner: null,
    table: [],
    successCreated: false,
    loading: false,
    error: '',
    game: 'Domino',
    id: ''
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
    async ({ context, tournament, payload }: { context: any, payload: any, tournament: any }) => {
        return context.updateTournament(tournament, payload);

    }
)


export const tournamentFinishFunction = createAsyncThunk(
    'tournaments/tournamentFinishFunction',
    async ({ context, tournamentId, winnerId }: { context: any, winnerId: string, tournamentId: string }) => {
        return context.finishTournament(tournamentId, winnerId);
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
            state.loading = true;
        });
        builder.addCase(tournamentUpdateFunction.fulfilled, (state, action) => {
            const { payload }: { payload: TournamentReducerInitialState } = action
        });
        builder.addCase(tournamentUpdateFunction.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.error;
        });

    }
});


export const { } = tournamentSlice.actions
export default tournamentSlice.reducer;
