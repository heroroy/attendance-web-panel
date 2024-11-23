import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth , database} from "../firebase.ts";
import {useState} from "react";

interface subjectState {
    subjectArray : {name : string , subject : Object}[]
    loading? : boolean,
    error? : string | null
}

const initialState: subjectState  = {
    subjectArray : [],
    loading : false,
    error : null
}


export const subjectAddThunk = createAsyncThunk<
    {} ,
    {
        creatorName : string,
        department : string,
        section : string,
        studentsEnrolled : string[],
        title : string,
        id : string,
        createdBy : string,
        createdAt : Date
    },
    {rejectValue : string}
>(
    'subject/add',
    async ({
               creatorName , department, section ,studentsEnrolled ,title ,id, createdBy
           },{rejectWithValue}) => {
        try{
            await database.collection("subjects").doc(`${id}`).set({
                creatorName : creatorName,
                department : department,
                section : section,
                studentsEnrolled : studentsEnrolled,
                title : title,
                id : id,
                createdBy : createdBy,
                createdAt : new Date()
            }).then(()=>{
                console.log("inserted")
            }).catch((error)=>{
                console.error("error", error)
            })
            return
            // console.log("res",res)
        }catch (error){
            return rejectWithValue(error)
        }
    }
)

export const getSubjectThunk= createAsyncThunk<
    {subjectArray : {name : string , subject : Object}[]},
    void,
    {rejectValue : string}
>(
    "subject/get",
    async (_,{rejectWithValue})=>{
            const subjectArray = []
        try {

            const querySnapshot = await database.collection("subjects").get();

                querySnapshot.forEach((doc)=>{
                    subjectArray.push( {
                        name : doc.id,
                        subject : doc.data()
                    });
                })
            // console.log(subjectArray)
                return { subjectArray : subjectArray }
        }catch (error){
            return rejectWithValue(error)
        }
    }
)

export const subjectSlice = createSlice({
    name : 'subject' ,
    initialState,
    reducers : {
        display(initialState){
            initialState
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(subjectAddThunk.pending,(state : subjectState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(subjectAddThunk.fulfilled,(state : subjectState ) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(subjectAddThunk.rejected,(state : subjectState, action : PayloadAction<String | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
            .addCase(getSubjectThunk.pending,(state : subjectState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSubjectThunk.fulfilled,(state : subjectState, action : PayloadAction<{subjectArray : {name : string , subject : Object}[]}> ) => {
                state.loading = false;
                state.error = null;
                state.subjectArray = action.payload.subjectArray
            })
            .addCase(getSubjectThunk.rejected,(state : subjectState, action : PayloadAction<String | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'subject not created'
            })
    }
})
