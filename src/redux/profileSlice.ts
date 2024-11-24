import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth, database} from "../firebase.ts";
import User from "../Model/User.ts";

interface ProfileState {
    profile: User | null
    loading: boolean,
    error: null | string
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null
}

export const loginThunk = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>(
    'profile/login',
    async (_, {rejectWithValue}) => {
        const provider = new GoogleAuthProvider()
        provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl")

        return await auth.signInWithPopup(provider)
            .then(result => result.user)
            .then(user => {
                if (!user) throw new Error("User is null")
                return user
            })
            .then(user => {
                if (user.email?.split('@')[1] !== 'rcciit.org.in')
                    throw new Error('Only RCC IIT domains are allowed to sign in')
                return user
            })
            .then(user => ({
                id: user.email?.split('@')[0],
                email: user.email,
                name: user.displayName,
                profilePic: user.photoURL,
            } as User))
            .then(user => (
                database.collection('users').doc(user.id).set(user)
                    .then(() => user)
            ))
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user))
                return user
            })
            .catch(e => rejectWithValue(e))
    }
)

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        display(initialState) {
            initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state: ProfileState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state: ProfileState, action: PayloadAction<User>) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload
            })
            .addCase(loginThunk.rejected, (state: ProfileState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "cannot load profile";
            })
    }
})