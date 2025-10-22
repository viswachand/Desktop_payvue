import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/api/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/api/apiHelpers"
import type { Sale } from "@payvue/shared/types/sale";

// ----------------------------------------------------
// State Interface
// ----------------------------------------------------
export interface ReportState {
  reports: Sale[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReportState = {
  reports: [],
  isLoading: false,
  error: null,
  success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

// Fetch all or filtered sales reports
export const fetchSalesReport = createAsyncThunk<
  Sale[],
  { search?: string; fromDate?: string; toDate?: string; saleType?: string; status?: string } | void,
  { rejectValue: string }
>("reports/fetchSalesReport", async (filters, { rejectWithValue }) => {
  try {
    let query = "";
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);
      if (filters.saleType) params.append("saleType", filters.saleType);
      if (filters.status) params.append("status", filters.status);
      query = `?${params.toString()}`;
    }

    const data = await safeApiCall<Sale[]>(() =>
      API.get(`/api/reports/sales${query}`)
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Delete sale from report
export const deleteSaleFromReport = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("reports/deleteSaleFromReport", async (id, { rejectWithValue }) => {
  try {
    await safeApiCall(() => API.delete(`/api/reports/sales/${id}`));
    return id; // return deleted id for UI update
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportError(state) {
      state.error = null;
    },
    clearReportState(state) {
      state.reports = [];
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchSalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch sales report";
      })

      // Delete sale
      .addCase(deleteSaleFromReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSaleFromReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.reports = state.reports.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteSaleFromReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete sale from report";
      });
  },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearReportError, clearReportState } = reportSlice.actions;

// Selectors
export const selectReports = (state: RootState) => state.reports.reports;
export const selectReportLoading = (state: RootState) => state.reports.isLoading;
export const selectReportError = (state: RootState) => state.reports.error;
export const selectReportSuccess = (state: RootState) => state.reports.success;

export default reportSlice.reducer;
