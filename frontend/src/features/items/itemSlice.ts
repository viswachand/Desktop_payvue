import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/services/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/utils/apiHelpers";
import type { RootState } from "@/app/store";
import type { Item } from "@payvue/shared/types/item";

// ----------------------------------------------------
// State
// ----------------------------------------------------
export interface ItemsState {
    items: Item[];
    selectedItem: Item | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ItemsState = {
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,
    success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

// Create Item
export const createItem = createAsyncThunk<
    Item,
    Partial<Item>,
    { rejectValue: string }
>("items/createItem", async (itemData, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Item>(() => API.post("/api/items", itemData));
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// Fetch All Items
export const fetchItems = createAsyncThunk<Item[], void, { rejectValue: string }>(
    "items/fetchItems",
    async (_, { rejectWithValue }) => {
        try {
            const data = await safeApiCall<Item[]>(() => API.get("/api/items"));
            return data;
        } catch (error) {
            return rejectWithValue(extractAxiosErrorMessage(error));
        }
    }
);

// Fetch Item By ID
export const fetchItemById = createAsyncThunk<Item, string, { rejectValue: string }>(
    "items/fetchItemById",
    async (id, { rejectWithValue }) => {
        try {
            const data = await safeApiCall<Item>(() => API.get(`/api/items/${id}`));
            return data;
        } catch (error) {
            return rejectWithValue(extractAxiosErrorMessage(error));
        }
    }
);

// Update Item
export const updateItem = createAsyncThunk<
    Item,
    { id: string; updates: Partial<Item> },
    { rejectValue: string }
>("items/updateItem", async ({ id, updates }, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Item>(() => API.put(`/api/items/${id}`, updates));
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// Delete Item
export const deleteItem = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("items/deleteItem", async (id, { rejectWithValue }) => {
    try {
        await safeApiCall(() => API.delete(`/api/items/${id}`));
        return id;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        clearItemsError(state) {
            state.error = null;
        },
        resetItemsState(state) {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
                state.success = true;
            })
            .addCase(createItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to create item";
            })

            // Fetch All
            .addCase(fetchItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to fetch items";
            })

            // Fetch by ID
            .addCase(fetchItemById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to fetch item";
            })

            // Update
            .addCase(updateItem.fulfilled, (state, action) => {
                state.isLoading = false;
                const idx = state.items.findIndex((i: Item) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
                state.success = true;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to update item";
            })

            // Delete
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter((i: Item) => i.id !== action.payload);
                state.success = true;
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to delete item";
            });
    },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearItemsError, resetItemsState } = itemsSlice.actions;

export const selectAllItems = (state: RootState) => state.items.items;
export const selectSelectedItem = (state: RootState) => state.items.selectedItem;
export const selectItemsLoading = (state: RootState) => state.items.isLoading;
export const selectItemsError = (state: RootState) => state.items.error;
export const selectItemsSuccess = (state: RootState) => state.items.success;

export default itemsSlice.reducer;
