import { TournamentInitialState } from '@/typesDefs/constants/tournaments/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TournamentInitialState[] = [];

const tournamentSlice = createSlice({
    name: 'tournament',
    initialState,
    reducers: {
        addTournament: (state, action) => { //pendiente por agregar el tipo al payload
            const { payload }: { payload: TournamentInitialState } = action;
            state.push(payload);
        }
    }
});


export const { addTournament } = tournamentSlice.actions
export default tournamentSlice.reducer;
