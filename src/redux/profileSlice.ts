import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth} from "../firebase.ts";

interface ProfileState {
    profile : {name : string,
        picture : string}
    loading : boolean,
    error : null | string
}

const initialState : ProfileState = {
    profile : {name : "",
        picture : ""},
    loading : false,
    error : null
}

export const loginThunk = createAsyncThunk<
    {profile : {name : string ,picture : string }},
    void,
    {rejectValue : string}
>(
    'profile/login',
    async (_,{rejectWithValue}) => {
        try{
            const provider = new GoogleAuthProvider()
            provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl")

            const res = await auth.signInWithPopup(provider)
            const token = await res?.credential?.accessToken;
            const user = res?.additionalUserInfo?.profile;

            const profile = {
                name : user?.name as String,
                pfp : user?.picture as String
            }
        return {profile : profile}
            // console.log("res",res)
        }catch (error){
            return rejectWithValue(error)
        }
    }
)

export const profileSlice = createSlice({
    name : 'profile' ,
    initialState,
    reducers : {
        display(initialState){
            initialState
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(loginThunk.pending,(state : ProfileState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state : ProfileState , action : PayloadAction<{profile : {name : string ,picture : string }}>) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload.profile
            })
            .addCase(loginThunk.rejected, (state : ProfileState , action : PayloadAction<String | undefined>) => {
                state.loading = false;
                state.error = action.payload || "cannot load profile";
            })
    }
})