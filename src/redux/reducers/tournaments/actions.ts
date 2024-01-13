import { TournamentInterface } from '@/typesDefs/constants/tournaments/types';
import organizeTournamentsPlayersArray from '@/utils/organize-tournaments-players-array';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface TournamentsInitialState {
  getTournaments: {
    loadingGetTournaments: boolean,
    successGetTournaments: boolean,
    tournamentsList: TournamentInterface[],
    errorGetTournaments: any | null
  }
  getTournamentById: {
    loadingGetTournamentById: boolean,
    successGetTournamentById: boolean,
    tournament: TournamentInterface | null,
    errorGetTournamentById: any | null
  },
  createTournament: {
    loadingCreateTournament: boolean,
    successCreateTournament: boolean,
    errorCreateTournament: any | null
  },
  updateTournament: {
    loadingUpdateTournament: boolean,
    successUpdateTournament: boolean,
    errorUpdateTournament: any | null
  },
  deleteTournament: {
    loadingDeleteTournament: boolean,
    successDeleteTournament: boolean,
    errorDeleteTournament: any | null
  }
}

const initialState: TournamentsInitialState = {
  getTournaments: {
    loadingGetTournaments: true,
    successGetTournaments: false,
    tournamentsList: [],
    errorGetTournaments: null
  },
  getTournamentById: {
    loadingGetTournamentById: false,
    successGetTournamentById: false,
    tournament: null,
    errorGetTournamentById: null
  },
  createTournament: {
    loadingCreateTournament: false,
    successCreateTournament: false,
    errorCreateTournament: null
  },
  updateTournament: {
    loadingUpdateTournament: false,
    successUpdateTournament: false,
    errorUpdateTournament: null
  },
  deleteTournament: {
    loadingDeleteTournament: false,
    successDeleteTournament: false,
    errorDeleteTournament: null
  }
};

export const getAllTournaments = createAsyncThunk(
  'tournaments/getAllTournaments',
   async (params:any, { rejectWithValue }) => {
    try {
      const response = await params.context.getAllTournaments()

      return response
    } catch (error) {
      rejectWithValue(error)
    }
  }
);

export const getTournamentById = createAsyncThunk(
  'tournaments/getTournamentById',
   async (params:any, { rejectWithValue }) => {
    try {
      const response = await params.context.getTournamentById(params.id)

      return response
    } catch (error) {
      rejectWithValue(error)
    }
  }
);

export const createTournament = createAsyncThunk(
  'tournaments/createTournament',
   async (params:any, { rejectWithValue }) => {
      const tables:any = organizeTournamentsPlayersArray(
        params.players 
      )

      if(tables?.error) {
        return rejectWithValue(tables?.error)
      }

      const response = await params.context.createTournament(
        params.name, 
        params.players, 
        tables, 
        params.format,
        params.customRounds
      )
      
      if(response.toString().includes("FirebaseError")) {
        return rejectWithValue(JSON.stringify(response))
      }

      return response
  }
);

export const updateTournament = createAsyncThunk(
  'tournaments/updateTournament',
   async (params:any, { rejectWithValue }) => {
      const response = await params.context.updateTournament(params.id, params.body)
      
      return response
  }
);

export const deleteTournament = createAsyncThunk(
  'tournaments/deleteTournament',
   async (params:any, { rejectWithValue }) => {
      const response = await params.context.deleteTournament(params.id)


      return response
  }
);


const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    clearGetTournaments: (state) => {
      state.getTournaments = initialState.getTournaments
    },
    clearCreateTournamentState: (state) => {
      state.createTournament = initialState.createTournament
    },
    clearUpdateTournamentState: (state) => {
      state.updateTournament = initialState.updateTournament
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTournaments.pending, (state, action: any) => {
      state.getTournaments.loadingGetTournaments = true;
    });
    builder.addCase(getAllTournaments.fulfilled, (state, action) => {
      const { payload }: { payload: any } = action;
      state.getTournaments.loadingGetTournaments = false;
      state.getTournaments.successGetTournaments = true;
      state.getTournaments.tournamentsList = payload;
      state.getTournaments.errorGetTournaments = null;
    });
    builder.addCase(getAllTournaments.rejected, (state, action: any) => {
      state.getTournaments.loadingGetTournaments = false;
      state.getTournaments.errorGetTournaments = action.error;
    });

    builder.addCase(getTournamentById.pending, (state, action: any) => {
      state.getTournamentById.loadingGetTournamentById = true;
    });
    builder.addCase(getTournamentById.fulfilled, (state, action) => {
      const { payload }: { payload: any } = action;
      state.getTournamentById.loadingGetTournamentById = false;
      state.getTournamentById.successGetTournamentById = true;
      state.getTournamentById.tournament = payload;
      state.getTournamentById.errorGetTournamentById = null;
    });
    builder.addCase(getTournamentById.rejected, (state, action: any) => {
      state.getTournamentById.loadingGetTournamentById = false;
      state.getTournamentById.errorGetTournamentById = action.error;
    });

    builder.addCase(createTournament.pending, (state, action: any) => {
      state.createTournament.loadingCreateTournament = true;
    });
    builder.addCase(createTournament.fulfilled, (state, action) => {
      state.createTournament.loadingCreateTournament = false;
      state.createTournament.successCreateTournament = true;
      state.createTournament.errorCreateTournament = null;
    });
    builder.addCase(createTournament.rejected, (state, action: any) => {
      state.createTournament.loadingCreateTournament = false;
      state.createTournament.errorCreateTournament = action.payload;
    });

    builder.addCase(updateTournament.pending, (state, action: any) => {
      state.updateTournament.loadingUpdateTournament = true;
    });
    builder.addCase(updateTournament.fulfilled, (state, action) => {
      state.updateTournament.loadingUpdateTournament = false;
      state.updateTournament.successUpdateTournament = true;
      state.updateTournament.errorUpdateTournament = null;
    });
    builder.addCase(updateTournament.rejected, (state, action: any) => {
      state.updateTournament.loadingUpdateTournament = false;
      state.updateTournament.errorUpdateTournament = action.payload;
    });

    builder.addCase(deleteTournament.pending, (state, action: any) => {
      state.deleteTournament.loadingDeleteTournament = true;
    });
    builder.addCase(deleteTournament.fulfilled, (state, action) => {
      state.deleteTournament.loadingDeleteTournament = false;
      state.deleteTournament.successDeleteTournament = true;
      state.deleteTournament.errorDeleteTournament = null;
    });
    builder.addCase(deleteTournament.rejected, (state, action: any) => {
      state.deleteTournament.loadingDeleteTournament = false;
      state.deleteTournament.errorDeleteTournament = action.payload;
    });
  }
});


export const { clearGetTournaments, clearCreateTournamentState, clearUpdateTournamentState } = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
