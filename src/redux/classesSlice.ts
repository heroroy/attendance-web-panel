import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";
import firebase from "firebase/compat/app";
import Toast from "../Util/Toast.ts";
import FieldValue = firebase.firestore.FieldValue;

interface classState {
    classes: Class[] | Class
    classloading?: boolean,
    classError?: string | null,
    toggleAttendanceLoading? : boolean,
    toggleAttendanceError? : string | null,
    deleteClassLoading? : boolean,
    deleteClassError? : string | null,
    classByIdLoading?: boolean,
    classByIdError?: string | null,

}

const initialState: classState = {
    classes: [],
    classloading: false,
    classError:  null,
    toggleAttendanceLoading : false,
    toggleAttendanceError : null,
    deleteClassLoading : false,
    deleteClassError :  null,
    classByIdLoading: false,
    classByIdError:  null,

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
    Promise<void>,
    { class: Class, roll: string },
    { rejectValue: string }
>(
    "class/manualAttendance",
    async ({class: classInfo, roll}, {rejectWithValue}) => {
        const exists = classInfo?.attendees?.includes(roll)
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
    Promise<void>,
    { id: string },
    { rejectValue: string }
>(
    "class/delete",
    async ({id}, {rejectWithValue}) => {

        // try {
        //     return await database.collection("classe").doc(id)
        //         .delete()
        // }catch (error){
        //     return rejectWithValue(error.message)
        // }

        return await database.collection("classes").doc(id)
            .delete()
            .catch(e => {
                Toast.showError("Failed to delete class")
                rejectWithValue(e.message)
            })
    }
)


export const classesSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        setPending(state: classState) {
            state.classByIdLoading = true;
            state.classByIdError = null
        },
        setClasses(state: classState, action: PayloadAction<Class>) {
            state.classByIdLoading = false;
            state.classByIdError = null;
            state.classes = action.payload
        },
        setError(state: classState, action: PayloadAction<string | undefined>) {
            state.classByIdLoading = false;
            state.classByIdError = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClassesThunk.pending, (state: classState) => {
                state.classloading = true;
                state.classError = null
            })
            .addCase(getClassesThunk.fulfilled, (state: classState, action: PayloadAction<Class[]>) => {
                state.classloading = false;
                state.classError = null;
                state.classes = action.payload
            })
            .addCase(getClassesThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.classloading = false;
                state.classError = action.payload || 'class not found'
            })
            .addCase(manualAttendanceThunk.pending, (state: classState) => {
                state.toggleAttendanceLoading = true;
                state.toggleAttendanceError = null
            })
            .addCase(manualAttendanceThunk.fulfilled, (state: classState) => {
                state.toggleAttendanceLoading = false;
                state.toggleAttendanceError = null;
            })
            .addCase(manualAttendanceThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.toggleAttendanceLoading = false;
                state.toggleAttendanceError = action.payload || "attendance couldn't updated";
            })
            .addCase(deleteClassThunk.pending, (state: classState) => {
                state.deleteClassLoading = true;
                state.deleteClassError = null
            })
            .addCase(deleteClassThunk.fulfilled, (state: classState) => {
                state.deleteClassLoading = false;
                state.deleteClassError = null;
            })
            .addCase(deleteClassThunk.rejected, (state: classState, action: PayloadAction<string | undefined>) => {
                state.deleteClassLoading = false;
                state.deleteClassError = action.payload;
            })
    }
})

const {setClasses, setError, setPending} = classesSlice.actions

