import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import Subject from "../Model/Subject.ts";


interface subjectState {
    subjects: Subject[]
    getSubLoading?: boolean,
    getSubError?: string | null,

}

const initialState: subjectState = {
    subjects: [],
    getSubLoading: false,
    getSubError:  null,

}




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
                },
                error => dispatch(setError(error.message))
            )
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
})

const {setSubjects, setError, setPending} = subjectSlice.actions
