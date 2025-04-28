import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import User from "../Model/User.ts";
import UserDataStore from "../data/UserDataStore.ts";

interface userState {
    users: User[]
    loading?: boolean,
    error?: string | null
}

const initialState: userState = {
    users: [],
    loading: false,
    error: null
}

export const getUsersByIdsThunk = createAsyncThunk<
    User[],
    { ids: string[] },
    { rejectValue: string }
>(
    "userId/getById",
    async ({ids}, { rejectWithValue }) => {
        return await UserDataStore.getUsersById(ids).catch(rejectWithValue)
    }
)

export const userByIdSlice = createSlice({
    name: 'userId',
    initialState,
    reducers: {
        display(initialState) {
            initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsersByIdsThunk.pending, (state: userState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getUsersByIdsThunk.fulfilled, (state: userState, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload
            })
            .addCase(getUsersByIdsThunk.rejected, (state: userState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'User not found'
            })
    }
})