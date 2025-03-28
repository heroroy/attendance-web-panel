import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";

interface classState {
    classes: Class[] | Class
    classloading?: boolean,
    classError?: string | null,
    classByIdLoading?: boolean,
    classByIdError?: string | null,

}

const initialState: classState = {
    classes: [],
    classloading: false,
    classError: null,
    classByIdLoading: false,
    classByIdError: null,

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
            .catch(e => rejectWithValue(e.message))
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
            .onSnapshot(
                (querySnapShot) => {
                    if (!querySnapShot.exists) dispatch(setError("Class does not exist"))
                    else dispatch(setClasses(querySnapShot.data() as Class))
                }, (error) => {
                    dispatch(setError(error.message))
                }
            )
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
    }
})

const {setClasses, setError, setPending} = classesSlice.actions

