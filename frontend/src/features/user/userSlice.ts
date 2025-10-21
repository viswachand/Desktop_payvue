import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/services/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/utils/apiHelpers";
import type { RootState } from "@/app/store";
import type { User } from "@payvue/shared/types/user";

/* ------------------------------------------------------------------ */
/* --------------------------- State Types -------------------------- */
/* ------------------------------------------------------------------ */

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/* ------------------------------------------------------------------ */
/* --------------------------- Initial State ------------------------ */
/* ------------------------------------------------------------------ */

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  success: false,
};

/* ------------------------------------------------------------------ */
/* ---------------------------- Thunks ------------------------------ */
/* ------------------------------------------------------------------ */

// 🔹 Fetch all users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await safeApiCall<User[]>(() => API.get("/api/users"));
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

// 🔹 Fetch user by ID
export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  "users/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await safeApiCall<User>(() => API.get(`/api/users/${id}`));
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

// 🔹 Add user
export const addUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  "users/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await safeApiCall<User>(() => API.post("/api/users/signup", payload));
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

// 🔹 Update user
export const updateUser = createAsyncThunk<User, { id: string; data: Partial<User> }, { rejectValue: string }>(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await safeApiCall<User>(() => API.put(`/api/users/update/${id}`, data));
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

// 🔹 Delete user
export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await safeApiCall(() => API.delete(`/api/users/${id}`));
      return id;
    } catch (error) {
      return rejectWithValue(extractAxiosErrorMessage(error));
    }
  }
);

/* ------------------------------------------------------------------ */
/* ----------------------------- Slice ------------------------------ */
/* ------------------------------------------------------------------ */

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.success = false;
    },
    resetSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users";
      })

      // Fetch single
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch user";
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = true;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add user";
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update user";
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete user";
      });
  },
});

/* ------------------------------------------------------------------ */
/* ---------------------------- Selectors --------------------------- */
/* ------------------------------------------------------------------ */

export const selectUsers = (state: RootState) => state.users.users;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectUserSuccess = (state: RootState) => state.users.success;

/* ------------------------------------------------------------------ */
/* ----------------------------- Exports ---------------------------- */
/* ------------------------------------------------------------------ */

export const { clearUserState, resetSelectedUser } = userSlice.actions;
export default userSlice.reducer;
