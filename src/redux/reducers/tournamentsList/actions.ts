import { Slice, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TournamentReducerInitialState } from "../tournament/actions";

interface TournamentListReducerInitialState {
    loading: boolean,
    error: string,
    data: TournamentReducerInitialState[]
}

const initialState = {
    loading: false,
    error: '',
    data: []
} as TournamentListReducerInitialState

export const getTournamentsList = createAsyncThunk(
    "tournaments/getTournamentsList",
    async (params: { context: any }) => {
        return params.context.getTournamentsList();
    }
)

export const tournamentGetById = createAsyncThunk(
    'tournaments/tournamentGetById',
    async ({ context, id }: { context: any, id: string }) => {
        return context.getTournamentById(id);
    }
);

const tournamentsListSlice: Slice<TournamentListReducerInitialState, {}, 'tournaments'> = createSlice({
    name: 'tournaments',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getTournamentsList.pending, (state, action: any) => {
            state.loading = true;
        });
        builder.addCase(getTournamentsList.fulfilled, (state, action: any) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getTournamentsList.rejected, (state, action: any) => {
            state.error = action.error;
        });
        builder.addCase(tournamentGetById.pending, (state, action: any) => {
            state.loading = true;
        });
        builder.addCase(tournamentGetById.fulfilled, (state, action: any) => {
            state.loading = false;
            state.data = [action.payload];
        });
        builder.addCase(tournamentGetById.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.error;
        });
    }
})
export default tournamentsListSlice.reducer;