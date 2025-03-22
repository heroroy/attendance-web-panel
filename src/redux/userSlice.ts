import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import _ from "lodash";
import User from "../Model/User.ts";

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
    { id: string[] },
    { rejectValue: string }
>(
    "userId/getById",
    async ({id}, { rejectWithValue }) => {
        const operations = _.chunk(id, 25).map(ids => getUsersByIds(ids))
        return await Promise.all(operations)
            .then(result => _.flatten(result))
            .catch(rejectWithValue)
    }
)

async function getUsersByIds(ids: string[]) {
    return database.collection("users")
        .where('id', 'in', ids)
        .get()
        .then(result => result.docs)
        .then(docs => docs.map(doc => doc.data() as User))
}


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