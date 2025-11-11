import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Item } from "@payvue/shared/types/item";
import { normalizeCartItem } from "@/utils/cartAdapter";

// -----------------------------------------
// Types
// -----------------------------------------
export interface CartItem extends Item {
    qty: number;
    taxApplied?: boolean;
    discount?: number;
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
        addToCart: (state, action: PayloadAction<Partial<Item>>) => {
            // Normalize incoming item shape (ensures itemName, costPrice, etc.)
            const normalized = normalizeCartItem(action.payload);

            const existing = state.items.find(
                (i: CartItem) => i.id === normalized.id
            );

            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...normalized, qty: 1 });
            }
        },

        // ✅ Remove item
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (i: CartItem) => i.id !== action.payload
            );
        },

        // ✅ Update quantity manually
        updateQuantity: (
            state,
            action: PayloadAction<{ id: string; qty: number }>
        ) => {
            const item = state.items.find((i: CartItem) => i.id === action.payload.id);
            if (item) {
                item.qty = action.payload.qty;
            }
        },

        // ✅ Update full cart item (used for editing custom/service entries)
        updateCartItem: (state, action: PayloadAction<CartItem>) => {
            const index = state.items.findIndex(
                (i: CartItem) => i.id === action.payload.id
            );
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.payload,
                };
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
export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
} = cartSlice.actions;

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
