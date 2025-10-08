// frontend/features/payment/paymentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface PaymentState {
    discount: number;
    comment: string;
}

const initialState: PaymentState = {
    discount: 0,
    comment: "",
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        setComment: (state, action: PayloadAction<string>) => {
            state.comment = action.payload;
        },
        clearPayment: (state) => {
            state.discount = 0;
            state.comment = "";
        },
    },
});

export const { setDiscount, setComment, clearPayment } = paymentSlice.actions;

export const selectDiscount = (state: RootState) => state.payment.discount;
export const selectComment = (state: RootState) => state.payment.comment;

export default paymentSlice.reducer;
