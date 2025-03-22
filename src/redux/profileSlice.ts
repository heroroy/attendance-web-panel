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
    profile: getProfileFromStorage(),
    loading: false,
    error: null
}

async function isTeacher(email: string) {
    return database.collection("emails").doc(email)
        .get()
        .then(doc => doc.exists)
}

export const loginThunk = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>(
    'profile/login',
    async (_, {rejectWithValue}) => {
        const provider = new GoogleAuthProvider()
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly")

        return await auth.signInWithPopup(provider)
            .then(result => result.user)
            .then(user => {
                if (!user) throw new Error("User is null")
                return user
            })
            .then(user => {
                if(!user.email) throw new Error("Email not found")
                return user
            })
            .then(user => {
                if (user.email?.split("@")[1] !== 'rcciit.org.in')
                    throw new Error('Only RCC IIT domains are allowed to sign in')
                return user
            })
            .then(async user => {
                if(!(await isTeacher(user.email ?? "")))
                    throw new Error('Only Registered teachers are allowed to sign in')
                return user
            })
            .then(user => ({
                id: user.email?.split('@')[0],
                email: user.email,
                name: user.displayName,
                profilePic: user.photoURL,
                role: "TEACHER"
            } as User))
            .then(user => (
                database.collection('users').doc(user.id).set(user)
                    .then(() => user)
            ))
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user))
                return user
            })
            .catch(e => {
                auth.signOut()
                return rejectWithValue(e.message)
            })
    }
)

export const logoutThunk = createAsyncThunk<
    void,
    void,
    {rejectValue : string}
>(
    'profile/logout',
    async (_, {rejectWithValue}) => {
            return await auth.signOut()
                    .then(()=>console.log("logged out"))
                    .catch((e)=>rejectWithValue(e.message))

    }
)

export const getProfileThunk = createAsyncThunk<User, void, { rejectValue: string }>(
    'profile/get',
    async (_, {rejectWithValue}) => {
        try {
            const userStr = localStorage.getItem('user')
            if (userStr == null) return rejectWithValue('User not found')
            return JSON.parse(userStr)
        } catch (e : any) {
            return rejectWithValue(e.message)
        }
    }
)

function getProfileFromStorage(){
    const userStr = localStorage.getItem('user')
    if (userStr == null) return null
    try {
        return JSON.parse(userStr)
    } catch(e){
        return null
    }
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        display() {
            getProfileThunk()
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
                state.error = action.payload || "Login failure";
            })
            .addCase(getProfileThunk.pending, (state: ProfileState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getProfileThunk.fulfilled, (state: ProfileState, action: PayloadAction<User>) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload
            })
            .addCase(getProfileThunk.rejected, (state: ProfileState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "cannot load profile";
            })
            .addCase(logoutThunk.pending, (state: ProfileState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(logoutThunk.fulfilled, (state: ProfileState) => {
                state.loading = false;
                state.error = null;
                state.profile = null
            })
            .addCase(logoutThunk.rejected, (state: ProfileState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "couldn't logout";
            })
    }
})