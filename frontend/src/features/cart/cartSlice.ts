import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Item } from "@payvue/shared/types/item";

// -----------------------------------------
// Types
// -----------------------------------------
export interface CartItem extends Item {
    qty: number;
}

export interface CartState {
    items: CartItem[];
}

// -----------------------------------------
// Initial State
// -----------------------------------------
const initialState: CartState = {
    items: [],
};

// -----------------------------------------
// Slice
// -----------------------------------------
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // ✅ Add item or increment if exists
        addToCart: (state, action: PayloadAction<Item>) => {
            const existing = state.items.find(
                (i: Item) => i.id === action.payload.id
            );

            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...action.payload, qty: 1 });
            }
        },

        // ✅ Remove item
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i: Item) => i.id !== action.payload);
        },

        // ✅ Update quantity manually
        updateQuantity: (
            state,
            action: PayloadAction<{ id: string; qty: number }>
        ) => {
            const item = state.items.find((i: Item) => i.id === action.payload.id);
            if (item) {
                item.qty = action.payload.qty;
            }
        },

        // ✅ Clear all cart items
        clearCart: (state) => {
            state.items = [];
        },
    },
});

// -----------------------------------------
// Exports
// -----------------------------------------
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;

// -----------------------------------------
// Selectors
// -----------------------------------------
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((sum: number, i: CartItem) => sum + i.qty, 0);

export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((sum: number, i: CartItem) => {
        const price = i.costPrice ?? 0;
        return sum + price * i.qty;
    }, 0);

// -----------------------------------------
export default cartSlice.reducer;
