// src/features/customer/customerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@payvue/shared/types/customer";
import type { RootState } from "@/app/store";

export interface CustomerState {
  data: Customer | null;
}

const initialState: CustomerState = { data: null };

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.data = action.payload;
    },
    clearCustomer: (state) => {
      state.data = null;
    },
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;
export const selectCustomer = (state: RootState) => state.customer.data;
export default customerSlice.reducer;
