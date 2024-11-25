import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth, database} from "../firebase.ts";
import {useState} from "react";
import Subject from "../Model/Subject.ts";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

import { collection, query, where, onSnapshot } from "firebase/firestore";
import {isArray , result} from "lodash";

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
        const fetchSubjects = async (): Promise<Subject[]> => {
            return new Promise((resolve, reject) => {

                database.collection("subjects")
                    .where('createdBy', '==', `${userId}`)
                    .onSnapshot((querySnapshot)=>{
                        let sub: Subject[] = [];
                        querySnapshot.forEach((doc) => {
                            sub.push(doc.data() as Subject);
                        });
                        // console.log("Current subjects:", sub);
                        resolve(sub);
                    },(error) => {
                        console.error("Error fetching subjects:", error);
                        reject(error);
                    })
            });
        };


        // return await database.collection("subjects")
        //     .where('createdBy', '==', `${ userId }`)
        //     .orderBy('created', 'desc')
        //     .fetchSubjects()
        //     .then(result => result.docs.map(doc =>doc.data() as Subject))
        //     .then(subjects => {
        //         console.log("Subjects = " + JSON.stringify(subjects))
        //         console.log(typeof subjects)
        //         return subjects
        //     })
        //     .catch(e => rejectWithValue(e))

            // .onSnapshot((snapshot)=>{
            //     sub  = []
            //     snapshot.forEach((doc) =>{
            //          sub.push(doc.data() as Subject);
            //     })
            //
            //     console.log(sub)
            // },(error)=>{
            //     return rejectWithValue(error)
            // })
            // console.log(sub)

        // const q = query(collection(database, "subjects"), where('createdBy', '==', `${ userId }`));
        // await onSnapshot(q, (querySnapshot) => {
        //     sub = [];
        //     querySnapshot.forEach((doc) => {
        //         sub.push(doc.data() as Subject);
        //         console.log(doc.data() as Subject)
        //     });
        //     console.log("Current cities in CA: ", sub);
        //     return sub
        // })

        return await fetchSubjects()
            .then((subjects)=>{
                // console.log("Subjects = " + JSON.stringify(subjects))
                return subjects
            })
            .catch(error=>{
                rejectWithValue(error())
            })

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
