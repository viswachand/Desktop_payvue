import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/api/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/api/apiHelpers";
import type { RootState } from "@/app/store";
import type { GoldBuy } from "@payvue/shared/types/goldBuy";

export interface GoldBuyState {
  records: GoldBuy[];
  selected: GoldBuy | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: GoldBuyState = {
  records: [],
  selected: null,
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
};

export const fetchGoldBuys = createAsyncThunk<
  GoldBuy[],
  void,
  { rejectValue: string }
>("goldBuy/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<GoldBuy[]>(() => API.get("/api/goldBuy"));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

export const fetchGoldBuyById = createAsyncThunk<
  GoldBuy,
  string,
  { rejectValue: string }
>("goldBuy/fetchById", async (id, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<GoldBuy>(() => API.get(`/api/goldBuy/${id}`));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

export const createGoldBuy = createAsyncThunk<
  GoldBuy,
  Partial<GoldBuy>,
  { rejectValue: string }
>("goldBuy/create", async (payload, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<GoldBuy>(() => API.post("/api/goldBuy", payload));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

export const updateGoldBuy = createAsyncThunk<
  GoldBuy,
  { id: string; updates: Partial<GoldBuy> },
  { rejectValue: string }
>("goldBuy/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<GoldBuy>(() => API.put(`/api/goldBuy/${id}`, updates));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

export const cancelGoldBuy = createAsyncThunk<
  GoldBuy,
  { id: string; reason?: string },
  { rejectValue: string }
>("goldBuy/cancel", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<GoldBuy>(() =>
      API.post(`/api/goldBuy/${id}/cancel`, { reason })
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

const goldBuySlice = createSlice({
  name: "goldBuy",
  initialState,
  reducers: {
    clearGoldBuyError(state) {
      state.error = null;
    },
    clearGoldBuySuccess(state) {
      state.successMessage = null;
    },
    setGoldBuySelected(state, action) {
      state.selected = action.payload;
    },
    resetGoldBuyState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoldBuys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoldBuys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchGoldBuys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to load gold buy tickets.";
      })
      .addCase(fetchGoldBuyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoldBuyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchGoldBuyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to load gold buy ticket.";
      })
      .addCase(createGoldBuy.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createGoldBuy.fulfilled, (state, action) => {
        state.isSaving = false;
        state.records.unshift(action.payload);
        state.successMessage = "Gold buy ticket created successfully.";
      })
      .addCase(createGoldBuy.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? "Failed to create gold buy ticket.";
      })
      .addCase(updateGoldBuy.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateGoldBuy.fulfilled, (state, action) => {
        state.isSaving = false;
        state.successMessage = "Gold buy ticket updated.";
        const idx = state.records.findIndex((ticket) => ticket.id === action.payload.id);
        if (idx !== -1) {
          state.records[idx] = action.payload;
        }
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateGoldBuy.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? "Failed to update gold buy ticket.";
      })
      .addCase(cancelGoldBuy.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(cancelGoldBuy.fulfilled, (state, action) => {
        state.isSaving = false;
        state.successMessage = "Gold buy ticket cancelled.";
        const idx = state.records.findIndex((ticket) => ticket.id === action.payload.id);
        if (idx !== -1) {
          state.records[idx] = action.payload;
        }
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(cancelGoldBuy.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? "Failed to cancel gold buy ticket.";
      });
  },
});

export const {
  clearGoldBuyError,
  clearGoldBuySuccess,
  setGoldBuySelected,
  resetGoldBuyState,
} = goldBuySlice.actions;

export default goldBuySlice.reducer;

export const selectGoldBuyState = (state: RootState) => state.goldBuy;
export const selectGoldBuyRecords = (state: RootState) => state.goldBuy.records;
export const selectGoldBuySelected = (state: RootState) => state.goldBuy.selected;
export const selectGoldBuyLoading = (state: RootState) => state.goldBuy.isLoading;
export const selectGoldBuySaving = (state: RootState) => state.goldBuy.isSaving;
export const selectGoldBuyError = (state: RootState) => state.goldBuy.error;
export const selectGoldBuySuccessMessage = (state: RootState) =>
  state.goldBuy.successMessage;
