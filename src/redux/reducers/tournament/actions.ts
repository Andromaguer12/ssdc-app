import { TablePlayers, TournamentFormat, TournamentInitialState } from '@/typesDefs/constants/tournaments/types';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
            won: 1,
            draw: 0,
            lost: 0,
            poitns: 0
        }
    ],
    successCreated: false,
    loading: false,
    error: ''
}

export const tournamentCreateFunction = createAsyncThunk(
    'tournaments/tournamentCreateFunction',
    async ({ context, tournamentData }: { context: any, tournamentData: TournamentInitialState }) => {
        const { name, rules, format, startDate, endDate, currentRound, winner, table } = tournamentData;
        console.log(name,
            rules,
            format,
            startDate,
            endDate,
            currentRound,
            winner,
            table)
        const tournamentCreated = await context.createTournament(
            name,
            rules,
            format,
            startDate,
            endDate,
            currentRound,
            winner,
            table,
        );
        
        console.log(tournamentCreated);
        return tournamentCreated
    }
)

interface TournamentReducerInitialState extends TournamentInitialState {
    successCreated: boolean,
    error: string,
    loading: boolean,
}

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
    }
});


export const { } = tournamentSlice.actions
export default tournamentSlice.reducer;
