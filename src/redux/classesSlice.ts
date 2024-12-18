import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import { database} from "../firebase.ts";
import {Class} from "../Model/classes.ts";

interface classState {
    classes : Class[] | Class
    loading? : boolean,
    error? : string | null
}

const initialState: classState  = {
    classes : [],
    loading : false,
    error : null
}

export const getClassesThunk= createAsyncThunk<
    Class[],
    { id : string },
    {rejectValue : string}
>(
    "class/get",
    async ({id},{rejectWithValue})=>{
        // const classArray = []
        // try {

        console.log(id)
            return await database.collection("classes")
                .where("subjectId" , "==" , id)
                .get()
                .then((result)=>{
                    return result.docs.map(doc=>doc.data() as Class)
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

export const getClassByIdThunk = createAsyncThunk<
    Class,
    {id : string},
    {rejectValue : string}
>(
    "class/getById",
    async ({id }, {rejectWithValue})=>{
        return await database.collection("classes").doc(`${id}`)
            .get()
            .then((result)=>{
                return result.data() as Class
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
            .addCase(getClassesThunk.fulfilled,(state : classState, action : PayloadAction<Class[]> ) => {
                state.loading = false;
                state.error = null;
                state.classes = action.payload
            })
            .addCase(getClassesThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
            .addCase(getClassByIdThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getClassByIdThunk.fulfilled,(state : classState, action : PayloadAction<Class> ) => {
                state.loading = false;
                state.error = null;
                state.classes = action.payload
            })
            .addCase(getClassByIdThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
            })
    }
})
