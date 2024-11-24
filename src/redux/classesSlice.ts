import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import {GoogleAuthProvider} from "firebase/auth";
import {auth , database} from "../firebase.ts";
import {useState} from "react";

interface classState {
    classArray : any[]
    loading? : boolean,
    error? : string | null
}

const initialState: classState  = {
    classArray : [],
    loading : false,
    error : null
}


// export const subjectAddThunk = createAsyncThunk<
//     {} ,
//     {
//         creatorName : string,
//         department : string,
//         section : string,
//         studentsEnrolled : string[],
//         title : string,
//         id : string,
//         createdBy : string
//     },
//     {rejectValue : string}
// >(
//     'subject/add',
//     async ({
//                creatorName , department, section ,studentsEnrolled ,title ,id, createdBy
//            },{rejectWithValue}) => {
//         try{
//             await database.collection("subjects").doc(`${id}`).set({
//                 creatorName : creatorName,
//                 department : department,
//                 section : section,
//                 studentsEnrolled : studentsEnrolled,
//                 title : title,
//                 id : id,
//                 createdBy : createdBy,
//                 createdAt : new Date()
//             }).then(()=>{
//                 console.log("inserted")
//             }).catch((error)=>{
//                 console.error("error", error)
//             })
//             return
//             // console.log("res",res)
//         }catch (error){
//             return rejectWithValue(error)
//         }
//     }
// )

export const getClassesThunk= createAsyncThunk<
    {classArray : any[]},
    { id : string },
    {rejectValue : string}
>(
    "class/get",
    async ({id},{rejectWithValue})=>{
        const classArray = []
        try {
            const querySnapshot_class = await database.collection("classes").get();
            // querySnapshot.forEach((doc)=>{
                querySnapshot_class.forEach((doc_class)=>{
                    Object.entries(doc_class.data()).map(([key, value])=>{
                        if(key==="subjectId"){
                            if(value===id){
                                classArray.push(doc_class.data())
                            }
                        }
                    })
                })
            // })
            console.log(classArray)
            return { classArray : classArray }
        }catch (error){
            return rejectWithValue(error)
        }
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
            .addCase(getClassesThunk.fulfilled,(state : classState, action : PayloadAction<{classArray : any[]}> ) => {
                state.loading = false;
                state.error = null;
                state.classArray = action.payload.classArray
            })
            .addCase(getClassesThunk.rejected,(state : classState, action : PayloadAction<String | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
    }
})
