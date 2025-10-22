import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/api/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/api/apiHelpers"
import type { Sale } from "@payvue/shared/types/sale";

// ----------------------------------------------------
// State Interface
// ----------------------------------------------------
export interface SaleState {
  sales: Sale[];
  currentSale: Sale | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SaleState = {
  sales: [],
  currentSale: null,
  isLoading: false,
  error: null,
  success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

export const createSale = createAsyncThunk<Sale, Sale, { rejectValue: string }>(
  "sales/createSale",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await safeApiCall<Sale>(() =>
        API.post("/api/sale", payload)
      );
      return data;
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

// 📦 Get All Sales
export const fetchSales = createAsyncThunk<
  Sale[],
  void,
  { rejectValue: string }
>("sales/fetchSales", async (_, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale[]>(() => API.get("/api/sale"));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// 🧾 Get Sale by ID
export const fetchSaleById = createAsyncThunk<
  Sale,
  string,
  { rejectValue: string }
>("sales/fetchSaleById", async (id, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale>(() => API.get(`/api/sale/${id}`));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// 💸 Refund Sale
export const refundSale = createAsyncThunk<
  Sale,
  string,
  { rejectValue: string }
>("sales/refundSale", async (id, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Sale>(() =>
      API.post(`/api/sale/${id}/refund`)
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const saleSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSaleError(state) {
      state.error = null;
    },
    clearSaleState(state) {
      state.sales = [];
      state.currentSale = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.sales.unshift(action.payload); // add new sale to top
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create sale";
      })

      // Fetch all
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch sales";
      })

      // Fetch by ID
      .addCase(fetchSaleById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch sale details";
      })

      // Refund
      .addCase(refundSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refundSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const updatedSale = action.payload;
        state.sales = state.sales.map((s: Sale) =>
          s.id === updatedSale.id ? updatedSale : s
        );
      })
      .addCase(refundSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to refund sale";
      });
  },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearSaleError, clearSaleState } = saleSlice.actions;

// Selectors
export const selectSales = (state: RootState) => state.sale.sales;
export const selectCurrentSale = (state: RootState) => state.sale.currentSale;
export const selectSaleLoading = (state: RootState) => state.sale.isLoading;
export const selectSaleError = (state: RootState) => state.sale.error;
export const selectSaleSuccess = (state: RootState) => state.sale.success;

export default saleSlice.reducer;
