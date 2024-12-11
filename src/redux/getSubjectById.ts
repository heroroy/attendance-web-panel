import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import Subject from "../Model/Subject.ts";
import {database} from "../firebase.ts";

interface subjectState {
    subject: Subject[]
    loading?: boolean,
    error?: string | null
}

const initialState: subjectState = {
    subject: [],
    loading: false,
    error: null
}

export const getSubjectByIdThunk = createAsyncThunk<
    Subject[],
    { id :string },
    {rejectValue : string}
>(
    "subjectId/getById",
    async ({id }, {rejectWithValue})=>{
        return await database.collection("subjects").doc(id)
            .get()
            .then(result=> {
                return result.data() as Subject[]
            })
            .then(subject=>{
                console.log(subject)
                return subject
            })
            .catch((error)=>{
                rejectWithValue(error)
            })
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
            .addCase(getSubjectByIdThunk.pending, (state: subjectState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSubjectByIdThunk.fulfilled, (state: subjectState, action: PayloadAction<Subject[]>) => {
                state.loading = false;
                state.error = null;
                state.subject = action.payload
            })
            .addCase(getSubjectByIdThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
    }
})