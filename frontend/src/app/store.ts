import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import itemReducer from "@/features/items/itemSlice";
import cartReducer from "@/features/cart/cartSlice";
import customerReducer from "@/features/customers/customerSlice";
import paymentReducer from "@/features/payments/paymentSlice";
import policyReducer from "@/features/policy/policySlice";
import saleReducer from "@/features/sales/saleSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        items: itemReducer,
        cart: cartReducer,
        customer: customerReducer,
        payment: paymentReducer,
        policy: policyReducer,
        sale: saleReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
