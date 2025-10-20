import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/services/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/utils/apiHelpers";
import type { Sale } from "@payvue/shared/types/sale";

// ----------------------------------------------------
// State Interface
// ----------------------------------------------------
export interface LayawayState {
  layaways: Sale[];
  currentLayaway: Sale | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: LayawayState = {
  layaways: [],
  currentLayaway: null,
  isLoading: false,
  error: null,
  success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

// Get All Layaway Sales
export const fetchLayaways = createAsyncThunk<
  Sale[],
  void,
  { rejectValue: string }
>("layaway/fetchLayaways", async (_, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale[]>(() => API.get("/api/layaway"));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Get Single Layaway by ID
export const fetchLayawayById = createAsyncThunk<
  Sale,
  string,
  { rejectValue: string }
>("layaway/fetchLayawayById", async (id, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale>(() => API.get(`/api/layaway/${id}`));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Add Payment to Layaway
export const addLayawayPayment = createAsyncThunk<
  Sale,
  { id: string; payload: any },
  { rejectValue: string }
>("layaway/addLayawayPayment", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale>(() =>
      API.post(`/api/layaway/${id}/payment`, payload)
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Create Historical Layaway (Pre-POS Record)
export const createHistoricalLayaway = createAsyncThunk<
  Sale,
  any,
  { rejectValue: string }
>("layaway/createHistoricalLayaway", async (payload, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale>(() =>
      API.post("/api/layaway/historical", payload)
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const layawaySlice = createSlice({
  name: "layaway",
  initialState,
  reducers: {
    clearLayawayError(state) {
      state.error = null;
    },
    clearLayawayState(state) {
      state.layaways = [];
      state.currentLayaway = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Layaways
      .addCase(fetchLayaways.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLayaways.fulfilled, (state, action) => {
        state.isLoading = false;
        state.layaways = action.payload;
      })
      .addCase(fetchLayaways.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch layaway sales";
      })

      // Fetch Single Layaway
      .addCase(fetchLayawayById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLayawayById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLayaway = action.payload;
      })
      .addCase(fetchLayawayById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch layaway details";
      })

      // Add Payment
      .addCase(addLayawayPayment.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(addLayawayPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        const updated = action.payload;

        // Update current layaway
        if (state.currentLayaway && state.currentLayaway.id === updated.id) {
          state.currentLayaway = updated;
        }

        // Update in list
        state.layaways = state.layaways.map((l) =>
          l.id === updated.id ? updated : l
        );
      })
      .addCase(addLayawayPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to add layaway payment";
      })

      // 🆕 Create Historical Layaway
      .addCase(createHistoricalLayaway.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(createHistoricalLayaway.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        // Add to top of list
        state.layaways.unshift(action.payload);
      })
      .addCase(createHistoricalLayaway.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? "Failed to create historical layaway";
      });
  },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearLayawayError, clearLayawayState } = layawaySlice.actions;

// Selectors
export const selectLayaways = (state: RootState) => state.layaway.layaways;
export const selectCurrentLayaway = (state: RootState) =>
  state.layaway.currentLayaway;
export const selectLayawayLoading = (state: RootState) =>
  state.layaway.isLoading;
export const selectLayawayError = (state: RootState) => state.layaway.error;
export const selectLayawaySuccess = (state: RootState) =>
  state.layaway.success;

export default layawaySlice.reducer;
