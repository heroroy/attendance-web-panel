import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import Subject from "../Model/Subject.ts";
import {database} from "../firebase.ts";

interface SubjectByIdState {
    subject: Subject | null
    loading?: boolean,
    error?: string | null
}

const initialState: SubjectByIdState = {
    subject: null,
    loading: false,
    error: null
}

export const getSubjectByIdThunk = createAsyncThunk<
    Subject,
    { id: string},
    { rejectValue: string }
>(
    "subjectId/getById",
    async ({id}, {rejectWithValue}) => {
        return await database.collection("subjects").doc(id)
            .get()
            .then(result => result.data() as Subject)
            .catch(rejectWithValue)
    }
)
export const subjectByIdSlice = createSlice({
    name: 'subjectId',
    initialState,
    reducers: {
        display(initialState) {
            initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubjectByIdThunk.pending, (state: SubjectByIdState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSubjectByIdThunk.fulfilled, (state: SubjectByIdState, action: PayloadAction<Subject>) => {
                state.loading = false;
                state.error = null;
                state.subject = action.payload
            })
            .addCase(getSubjectByIdThunk.rejected, (state: SubjectByIdState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Invalid subject Id"
            })
    }
})