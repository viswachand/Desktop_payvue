import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/services/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/utils/apiHelpers";
import { persistAuth, clearAuth, getStoredAuth } from "@/utils/storage";
import { User } from "@payvue/shared/types/user";


export interface AuthState {
    token: string | null;
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    currentUser: null,
    isLoading: false,
    error: null,
    success: false,
    isAuthenticated: false,
};


export const loginUser = createAsyncThunk<
    { token: string; user: User },
    { username: string; password: string },
    { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<{ token: string; user: User }>(() =>
            API.post("/api/users/login", credentials)
        );

        persistAuth(data.token, data.user);
        API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

export const fetchCurrentUser = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<User>(() =>
            API.get("/api/users/currentuser")
        );

        // API returns data as array [user]
        return Array.isArray(data) ? data[0] : data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

export const initializeAuth = createAsyncThunk<
    { token: string; user: User },
    void,
    { rejectValue: string }
>("auth/initializeAuth", async (_, { rejectWithValue }) => {
    try {
        const stored = getStoredAuth();
        if (!stored?.token) throw new Error("No stored session");

        API.defaults.headers.common["Authorization"] = `Bearer ${stored.token}`;
        const verifiedUser = await safeApiCall<User>(() =>
            API.get("/api/users/currentuser")
        );

        return { token: stored.token, user: Array.isArray(verifiedUser) ? verifiedUser[0] : verifiedUser };
    } catch (error) {
        clearAuth();
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
        logout(state) {
            clearAuth();
            state.token = null;
            state.currentUser = null;
            state.isAuthenticated = false;
            delete API.defaults.headers.common["Authorization"];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.success = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Login failed";
                state.isAuthenticated = false;
            })

            // Fetch current user
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to fetch user";
                state.isAuthenticated = false;
            })

            // Initialize auth
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to initialize auth";
                state.isAuthenticated = false;
            });
    },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearAuthError, logout } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
    state.auth.isAuthenticated;
export const selectIsAdmin = (state: RootState) =>
    state.auth.currentUser?.isAdmin ?? false;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;
