import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import Subject from "../Model/Subject.ts";


interface subjectState {
    subjects: Subject[]
    loading?: boolean,
    error?: string | null
}

const initialState: subjectState = {
    subjects: [],
    loading: false,
    error: null
}


export const subjectAddThunk = createAsyncThunk<
    void,
    Subject,
    { rejectValue: string }
>(
    'subject/add',
    async (subject: Subject, {rejectWithValue}) => {

        console.log(subject)

        await database.collection("subjects")
            .doc(subject.id)
            .set(subject)
            .catch(error => {
                console.error("error", error)
                rejectWithValue(error)
            })
    }
)

export const getSubjectThunk = createAsyncThunk<
    void,
    { userId: string },
    { rejectValue: string }
>(
    "subject/get",
    async ({userId}, {dispatch}) => {
        dispatch(setPending())
        database.collection("subjects")
            .where('createdBy', '==', `${userId}`)
            .orderBy('created', 'desc')
            .onSnapshot((querySnapshot) => {
                console.log("Snapshot =", querySnapshot.docs)
                dispatch(setSubjects(querySnapshot.docs.map(doc => doc.data() as Subject)))
                // resolve(sub)
            }, (error) => {
                console.error("Error fetching subjects:", error);
                dispatch(setError(error.message))
            })
    }
)

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setPending(state: subjectState) {
            state.loading = true;
            state.error = null;
        },
        setSubjects(state: subjectState, action: PayloadAction<Subject[]>) {
            state.loading = false;
            state.error = null;
            state.subjects = action.payload;
        },
        setError(state: subjectState, action: PayloadAction<string | undefined>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subjectAddThunk.pending, (state: subjectState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(subjectAddThunk.fulfilled, (state: subjectState) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(subjectAddThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
    }
})

const {setSubjects, setError, setPending} = subjectSlice.actions
