import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/services/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/utils/apiHelpers";
import type { RootState } from "@/app/store";
import { Category } from "@payvue/shared/types/category";


export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

// Create Category
export const createCategory = createAsyncThunk<
  Category,
  Partial<Category>,
  { rejectValue: string }
>("categories/createCategory", async (categoryData, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Category>(() => API.post("/api/categories", categoryData));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Fetch All Categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Category[]>(() => API.get("/api/categories"));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Fetch Category By ID
export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("categories/fetchCategoryById", async (id, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Category>(() => API.get(`/api/categories/${id}`));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Update Category
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; updates: Partial<Category> },
  { rejectValue: string }
>("categories/updateCategory", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const data = await safeApiCall<Category>(() => API.put(`/api/categories/${id}`, updates));
    return data;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// Delete Category
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("categories/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    await safeApiCall(() => API.delete(`/api/categories/${id}`));
    return id;
  } catch (error) {
    return rejectWithValue(extractAxiosErrorMessage(error));
  }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
    resetCategoryState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.unshift(action.payload);
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create category";
      })

      // Fetch All
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch categories";
      })

      // Fetch by ID
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch category";
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.categories.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.categories[idx] = action.payload;
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update category";
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter((c) => c.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete category";
      });
  },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearCategoryError, resetCategoryState } = categorySlice.actions;

export const selectAllCategories = (state: RootState) => state.categories.categories;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectCategoryLoading = (state: RootState) => state.categories.isLoading;
export const selectCategoryError = (state: RootState) => state.categories.error;
export const selectCategorySuccess = (state: RootState) => state.categories.success;

export default categorySlice.reducer;
