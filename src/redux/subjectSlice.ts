import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth, database} from "../firebase.ts";
import {useState} from "react";
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
        await database.collection("subjects")
            .doc(subject.id)
            .set(subject)
            .then(() => console.log("inserted"))
            .catch(error => {
                console.error("error", error)
                rejectWithValue(error)
            })
    }
)

export const getSubjectThunk = createAsyncThunk<
    Subject[],
    { userId: string },
    { rejectValue: string }
>(
    "subject/get",
    async ({ userId }, {rejectWithValue}) => {
        return await database.collection("subjects")
            .where('createdBy', '==', userId)
            .orderBy('created', 'desc')
            .get()
            .then(result => result.docs.map(doc =>doc.data() as Subject))
            .catch(e => rejectWithValue(e))
    }
)

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        display(initialState) {
            initialState
        }
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
            .addCase(getSubjectThunk.pending, (state: subjectState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSubjectThunk.fulfilled, (state: subjectState, action: PayloadAction<Subject[]>) => {
                state.loading = false;
                state.error = null;
                state.subjects = action.payload
            })
            .addCase(getSubjectThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
    }
})
