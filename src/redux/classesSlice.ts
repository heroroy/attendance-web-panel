import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth , database} from "../firebase.ts";
import {useState} from "react";
import Subject from "../Model/Subject.ts";
import {Classes} from "../Model/classes.ts";
import {result} from "lodash";

interface classState {
    classArray : Classes[]
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
                .then(classes=>{
                    return database.collection("subjects").doc(`${id}`)
                        .get()
                        .then((result)=> {
                            console.log(result.data())
                            // return result.data()

                            classes[0].department = result.data().department
                            classes[0].section = result.data().section
                            classes[0].title = result.data().title

                            console.log(classes)
                            return  classes as Classes
                        })
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
    }
})
