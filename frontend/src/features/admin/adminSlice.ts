import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/api/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/api/apiHelpers";
import {AdminConfig} from "@payvue/shared/types/admin"


export interface AdminState {
  config: AdminConfig | null;
  isLoading: boolean;
  success: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: AdminState = {
  config: null,
  isLoading: false,
  success: false,
  error: null,
  lastFetched: null,
};

// -------------------------------------------------------------------
// Async Thunks
// -------------------------------------------------------------------

export const fetchAdminConfig = createAsyncThunk<
  AdminConfig,
  void,
  { rejectValue: string }
>("admin/fetchAdminConfig", async (_, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<AdminConfig>(() => API.get("/api/admin"));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});


export const createOrUpdateAdminConfig = createAsyncThunk<
  AdminConfig,
  AdminConfig,
  { rejectValue: string }
>("admin/createOrUpdateAdminConfig", async (config, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<AdminConfig>(() =>
      API.post("/api/admin", config)
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});


export const deleteAdminConfig = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("admin/deleteAdminConfig", async (_, { rejectWithValue }) => {
  try {
    await safeApiCall(() => API.delete("/api/admin"));
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// -------------------------------------------------------------------
// Slice
// -------------------------------------------------------------------
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
    resetAdminSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAdminConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
      })
      .addCase(fetchAdminConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch admin config";
      })

      // Create / Update
      .addCase(createOrUpdateAdminConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrUpdateAdminConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
        state.success = true;
      })
      .addCase(createOrUpdateAdminConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update admin config";
      })

      // Delete
      .addCase(deleteAdminConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAdminConfig.fulfilled, (state) => {
        state.isLoading = false;
        state.config = null;
        state.success = true;
      })
      .addCase(deleteAdminConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete admin config";
      });
  },
});

// -------------------------------------------------------------------
// Selectors
// -------------------------------------------------------------------
export const selectAdminConfig = (state: RootState) => state.admin.config;
export const selectAdminLoading = (state: RootState) => state.admin.isLoading;
export const selectAdminError = (state: RootState) => state.admin.error;
export const selectAdminSuccess = (state: RootState) => state.admin.success;

// -------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------
export const { clearAdminError, resetAdminSuccess } = adminSlice.actions;

export default adminSlice.reducer;
