import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth , database} from "../firebase.ts";
import {useState} from "react";
import Subject from "../Model/Subject.ts";
import {Classes} from "../Model/classes.ts";
import {result} from "lodash";

interface classState {
    classArray : Classes[] | Classes
    loading? : boolean,
    error? : string | null
}

const initialState: classState  = {
    classArray : [],
    loading : false,
    error : null
}

export const getClassesThunk= createAsyncThunk<
    Classes[],
    { id : string },
    {rejectValue : string}
>(
    "class/get",
    async ({id},{rejectWithValue})=>{
        // const classArray = []
        // try {

        console.log(id)
            return await database.collection("classes")
                .where("subjectId" , "==" , `${id}`)
                .get()
                .then((result)=>{
                    return result.docs.map(doc=>doc.data() as Classes)
                })
                .then((classes)=>{
                    console.log(classes)
                    return classes
                })
                .catch(e=>{
                    return rejectWithValue(e)
                })
            // querySnapshot.forEach((doc)=>{
            //     querySnapshot_class.forEach((doc_class)=>{
            //         Object.entries(doc_class.data()).map(([key, value])=>{
            //             if(key==="subjectId"){
            //                 if(value===id){
            //                     classArray.push(doc_class.data())
            //                 }
            //             }
            //         })
            //     })
            // })
            // console.log(classArray)
            // return { classArray : classArray }
        // }catch (error){
        //     return rejectWithValue(error)
        // }
    }
)

export const getClassesByIdThunk = createAsyncThunk<
    Classes,
    {id : string},
    {rejectValue : string}
>(
    "class/getById",
    async ({id }, {rejectWithValue})=>{
        return await database.collection("classes").doc(`${id}`)
            .get()
            .then((result)=>{
                return result.data() as Classes
            }).then((classes)=>{
                console.log(classes)
                return classes
            })
            .catch(error=>{
                return rejectWithValue(error)
            })
    }
)


export const classesSlice = createSlice({
    name : 'class' ,
    initialState,
    reducers : {
        display(initialState){
            initialState
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(getClassesThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getClassesThunk.fulfilled,(state : classState, action : PayloadAction<Classes[]> ) => {
                state.loading = false;
                state.error = null;
                state.classArray = action.payload
            })
            .addCase(getClassesThunk.rejected,(state : classState, action : PayloadAction<String | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
            .addCase(getClassesByIdThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getClassesByIdThunk.fulfilled,(state : classState, action : PayloadAction<Classes> ) => {
                state.loading = false;
                state.error = null;
                state.classArray = action.payload
            })
            .addCase(getClassesByIdThunk.rejected,(state : classState, action : PayloadAction<String | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
    }
})
