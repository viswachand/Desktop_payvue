import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import itemReducer from "@/features/items/itemSlice";
import cartReducer from "@/features/cart/cartSlice";
import customerReducer from "@/features/customers/customerSlice";
import paymentReducer from "@/features/payments/paymentSlice";
import policyReducer from "@/features/policy/policySlice";
import saleReducer from "@/features/sales/saleSlice";
import adminReducer from "@/features/admin/adminSlice"
import layawayReducer from "@/features/layaway/layawaySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        items: itemReducer,
        cart: cartReducer,
        customer: customerReducer,
        payment: paymentReducer,
        policy: policyReducer,
        sale: saleReducer,
        admin:adminReducer,
        layaway:layawayReducer
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
