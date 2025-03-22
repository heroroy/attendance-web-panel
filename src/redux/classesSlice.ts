import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";
import firebase from "firebase/compat/app";
import Toast from "../Util/Toast.ts";
import FieldValue = firebase.firestore.FieldValue;

interface classState {
    classes: Class[] | Class
    loading?: boolean,
    error?: string | null,
}

const initialState: classState = {
    classes: [],
    loading: false,
    error: null,
    deleteComplete: false,
}

export const getClassesThunk = createAsyncThunk<
    Class[],
    { id: string },
    { rejectValue: string }
>(
    "class/get",
    async ({id}, {rejectWithValue}) => {
        return await database.collection("classes")
            .where("subjectId", "==", id)
            .get()
            .then(result => result.docs)
            .then(docs => docs.map(doc => doc.data() as Class))
            .catch(rejectWithValue)
    }
)

export const getClassByIdThunk = createAsyncThunk<
    void,
    { id: string },
    { rejectValue: string }
>(
    "class/getById",
    async ({id}, {dispatch}) => {
        dispatch(setPending())
        database.collection("classes")
            .doc(`${id}`)
            .onSnapshot((querySnapShot) => {
                dispatch(setClasses(querySnapShot.data() as Class))
            }, (error) => {
                dispatch(setError(error.message))
            })
    }
)

export const manualAttendanceThunk = createAsyncThunk<
    void,
    { class: Class, roll: string },
    { rejectValue: string }
>(
    "class/manualAttendance",
    async ({class: classInfo, roll}, {rejectWithValue}) => {
        const exists = classInfo.attendees.includes(roll)
        return await database.collection("classes")
            .doc(classInfo.id)
            .update({
                attendees: exists ? FieldValue.arrayRemove(roll) : FieldValue.arrayUnion(roll)
            })
            .catch(e => {
                Toast.showError("Failed to update attendance")
                rejectWithValue(e)
            })
    }
)

export const deleteClassThunk = createAsyncThunk<
    void,
    { id: string },
    { rejectValue: string }
>(
    "class/delete",
    async ({id}, {rejectWithValue}) => {
        return await database.collection("classes").doc(id)
            .delete()
            .catch(e => {
                Toast.showError("Failed to delete class")
                return rejectWithValue(e)
            })
    }
)


export const classesSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        setPending(state: classState) {
            state.loading = true;
            state.error = null
        },
        setClasses(state: classState, action: PayloadAction<Class>) {
            state.loading = false;
            state.error = null;
            state.classes = action.payload
        },
        setError(state: classState, action: PayloadAction<string | undefined>) {
            state.loading = false;
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClassesThunk.pending, (state: classState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getClassesThunk.fulfilled, (state: classState, action: PayloadAction<Class[]>) => {
                state.loading = false;
                state.error = null;
                state.classes = action.payload
            })
            .addCase(getClassesThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
            .addCase(manualAttendanceThunk.pending, (state: classState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(manualAttendanceThunk.fulfilled, (state: classState) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(manualAttendanceThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
            })
            .addCase(deleteClassThunk.pending, (state: classState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteClassThunk.fulfilled, (state: classState) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteClassThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
            })
    }
})

const {setClasses, setError, setPending} = classesSlice.actions

