import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { API } from "@/api/axios";
import { safeApiCall, extractAxiosErrorMessage } from "@/api/apiHelpers"
import type { Policy } from "@payvue/shared/types/policy";

// ----------------------------------------------------
// Types
// ----------------------------------------------------
export interface PolicyState {
    policies: Policy[];
    currentPolicy: Policy | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: PolicyState = {
    policies: [],
    currentPolicy: null,
    isLoading: false,
    error: null,
    success: false,
};

// ----------------------------------------------------
// Async Thunks
// ----------------------------------------------------

// ✅ Create Policy
export const createPolicy = createAsyncThunk<
    Policy,
    Partial<Policy>,
    { rejectValue: string }
>("policies/createPolicy", async (policyData, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Policy>(() =>
            API.post("/api/policies", policyData)
        );
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ✅ Get All Policies
export const fetchPolicies = createAsyncThunk<
    Policy[],
    void,
    { rejectValue: string }
>("policies/fetchPolicies", async (_, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Policy[]>(() => API.get("/api/policies"));
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ✅ Get Policy by ID
export const fetchPolicyById = createAsyncThunk<
    Policy,
    string,
    { rejectValue: string }
>("policies/fetchPolicyById", async (id, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Policy>(() => API.get(`/api/policies/${id}`));
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ✅ Update Policy
export const updatePolicy = createAsyncThunk<
    Policy,
    { id: string; updates: Partial<Policy> },
    { rejectValue: string }
>("policies/updatePolicy", async ({ id, updates }, { rejectWithValue }) => {
    try {
        const data = await safeApiCall<Policy>(() =>
            API.put(`/api/policies/${id}`, updates)
        );
        return data;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ✅ Delete Policy
export const deletePolicy = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("policies/deletePolicy", async (id, { rejectWithValue }) => {
    try {
        await safeApiCall(() => API.delete(`/api/policies/${id}`));
        return id;
    } catch (error) {
        return rejectWithValue(extractAxiosErrorMessage(error));
    }
});

// ----------------------------------------------------
// Slice
// ----------------------------------------------------
const policySlice = createSlice({
    name: "policies",
    initialState,
    reducers: {
        clearPolicyError(state) {
            state.error = null;
        },
        clearCurrentPolicy(state) {
            state.currentPolicy = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- Create ---------- */
            .addCase(createPolicy.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPolicy.fulfilled, (state, action) => {
                state.isLoading = false;
                state.policies.unshift(action.payload);
                state.success = true;
            })
            .addCase(createPolicy.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to create policy";
            })

            /* ---------- Fetch All ---------- */
            .addCase(fetchPolicies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPolicies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.policies = action.payload;
            })
            .addCase(fetchPolicies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to fetch policies";
            })

            /* ---------- Fetch By ID ---------- */
            .addCase(fetchPolicyById.fulfilled, (state, action) => {
                state.currentPolicy = action.payload;
            })
            .addCase(fetchPolicyById.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to fetch policy";
            })

            /* ---------- Update ---------- */
            .addCase(updatePolicy.fulfilled, (state, action) => {
                const index = state.policies.findIndex((p: Policy) => p.id === action.payload.id);
                if (index !== -1) state.policies[index] = action.payload;
                if (state.currentPolicy?.id === action.payload.id)
                    state.currentPolicy = action.payload;
            })
            .addCase(updatePolicy.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to update policy";
            })

            /* ---------- Delete ---------- */
            .addCase(deletePolicy.fulfilled, (state, action) => {
                state.policies = state.policies.filter((p: Policy) => p.id !== action.payload);
            })
            .addCase(deletePolicy.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to delete policy";
            });
    },
});

// ----------------------------------------------------
// Exports
// ----------------------------------------------------
export const { clearPolicyError, clearCurrentPolicy } = policySlice.actions;

// Selectors
export const selectAllPolicies = (state: RootState) => state.policy.policies;
export const selectCurrentPolicy = (state: RootState) =>
    state.policy.currentPolicy;
export const selectPoliciesLoading = (state: RootState) =>
    state.policy.isLoading;
export const selectPoliciesError = (state: RootState) => state.policy.error;

export default policySlice.reducer;
