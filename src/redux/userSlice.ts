import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import {User} from "../Model/users.ts";

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
                state.error = action.payload || 'subject not created'
            })
    }
})