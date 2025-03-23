import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import Subject from "../Model/Subject.ts";
import Toast from "../Util/Toast.ts";


interface subjectState {
    subjects: Subject[]
    subjectAddLoading?: boolean,
    subjectAddError?: string | null,
    getSubLoading?: boolean,
    getSubError?: string | null,
    deleteSubLoading?: boolean,
    deleteSubError?: string | null,
}

const initialState: subjectState = {
    subjects: [],
    subjectAddLoading: false,
    subjectAddError:  null,
    getSubLoading: false,
    getSubError:  null,
    deleteSubLoading: false,
    deleteSubError:  null,
}


export const subjectAddThunk = createAsyncThunk<
    Promise<void>,
    Subject,
    { rejectValue: string }
>(
    'subject/add',
    async (subject: Subject, {rejectWithValue}) => {
        await database.collection("subjects")
            .doc(subject.id)
            .set(subject)
            .catch(e => {
                Toast.showError("Failed to create subject")
                rejectWithValue(e)
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
            .onSnapshot(
                (querySnapshot) => {
                    dispatch(setSubjects(querySnapshot.docs.map(doc => doc.data() as Subject)))
                    // resolve(sub)
                },
                error => dispatch(setError(error.message))
            )
    }
)

export const deleteSubjectThunk = createAsyncThunk<
    Promise<void>,
    { id: string },
    { rejectValue: string }
>(
    "subject/delete",
    async ({id}, {rejectWithValue}) => {
        return await database.collection("subjects").doc(id)
            .delete()
            .catch(e => {
                Toast.showError("Failed to delete subject")
                rejectWithValue(e)
            })
    }
)


export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setPending(state: subjectState) {
            state.getSubLoading = true;
            state.getSubError = null;
        },
        setSubjects(state: subjectState, action: PayloadAction<Subject[]>) {
            state.getSubLoading = false;
            state.getSubError = null;
            state.subjects = action.payload;
        },
        setError(state: subjectState, action: PayloadAction<string | undefined>) {
            state.getSubLoading = false;
            state.getSubError = action.payload || "Subject not found";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subjectAddThunk.pending, (state: subjectState) => {
                state.subjectAddLoading = true;
                state.subjectAddError = null
            })
            .addCase(subjectAddThunk.fulfilled, (state: subjectState) => {
                state.subjectAddLoading = false;
                state.subjectAddError = null;

            })
            .addCase(subjectAddThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.subjectAddLoading = false;
                state.subjectAddError = action.payload || 'subject not created'
            })
            .addCase(deleteSubjectThunk.pending, (state: subjectState) => {
                state.deleteSubLoading = true;
                state.deleteSubError = null
            })
            .addCase(deleteSubjectThunk.fulfilled, (state: subjectState) => {
                state.deleteSubLoading = false;
                state.deleteSubError = null;

            })
            .addCase(deleteSubjectThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.deleteSubLoading = false;
                state.deleteSubError = action.payload || 'subject not deleted'
            })
    }
})

const {setSubjects, setError, setPending} = subjectSlice.actions
