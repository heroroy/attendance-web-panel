import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import {Users} from "../Model/users.ts";

interface userState {
    users: Users[]
    loading?: boolean,
    error?: string | null
}

const initialState: userState = {
    users: [],
    loading: false,
    error: null
}

export const getUsersByIdThunk = createAsyncThunk<
    Users[],
    { id :string[] },
    {rejectValue : string}
>(
    "userId/getById",
    async ({id }, {rejectWithValue})=>{
        console.log(id)
             return await database.collection("users")
                 .where('id' , 'in' , id)
                .get()
                .then(result=> {
                   return result.docs.map(doc=> doc.data())
                })
                .then(users=>{
                    console.log(users)
                    return users
                })
                .catch((error)=>{
                    rejectWithValue(error)
                })
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
            .addCase(getUsersByIdThunk.pending, (state: userState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getUsersByIdThunk.fulfilled, (state: userState, action: PayloadAction<Users[]>) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload
            })
            .addCase(getUsersByIdThunk.rejected, (state: userState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
    }
})