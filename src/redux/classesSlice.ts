import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import { database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {toast} from "react-toastify";

interface classState {
    classes : Class[] | Class
    loading? : boolean,
    error? : string | null,

}

const initialState: classState  = {
    classes : [],
    loading : false,
    error : null,

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
    }
)

export const getClassByIdThunk = createAsyncThunk<
    void,
    {id : string},
    {rejectValue : string}
>(
    "class/getById",
    async ({id }, { dispatch})=>{
        dispatch(setPending())
        await database.collection("classes").doc(`${id}`)
            .onSnapshot((querySnapShot)=>{
                dispatch(setClasses(querySnapShot.data() as Class))
            },(error)=>{
                dispatch(setError(error.message))
            })
    }
)

export const manualAttendanceThunk = createAsyncThunk<
    void,
    {classes : Class, roll : string},
    {rejectValue : string}
>(
    "class/manualAttendance",
    async ({classes,roll}, {rejectWithValue})=>{


        return  await  updateDoc(doc(database,"classes",`${classes?.id}`),{
            attendees : classes?.attendees?.includes(roll) ? arrayRemove(roll) : arrayUnion(roll)
        })
            .then(()=> {
                console.log("doc updated successfully")
                setTimeout(()=>{
                    toast("doc updated successfully",{
                        type : "success",
                        theme : "colored",
                        position : "top-center",
                        draggable: true,
                        autoClose : 2000,

                    })
                },300)
                // return  "doc updated successfully"
            })
            .catch(error=> {
                return rejectWithValue ( error.message )
            })
    }
)

export const deleteClassThunk = createAsyncThunk<
    void,
    { id: string },
    {rejectValue : string}
>(
    "class/delete",
    async ({ id }, { rejectWithValue }) => {

        return await database.collection("classes").doc(`${id}`)
            .delete()
            .then(()=> {
                setTimeout(()=>{
                    toast("class deleted successfully",{
                        type : "success",
                        theme : "colored",
                        position : "top-center",
                        draggable: true,
                        autoClose : 2000,

                    })
                },300)
                console.log ( "class deleted successfully" )
            })
            .catch((error)=> {
                return rejectWithValue ( error )
            })
    }
)


export const classesSlice = createSlice({
    name : 'class' ,
    initialState,
    reducers : {
        setPending(state : classState){
            state.loading = true;
            state.error = null
        },
        setClasses(state : classState, action : PayloadAction<Class>){
            state.loading = false;
            state.error = null;
            state.classes = action.payload
        },
        setError(state : classState, action : PayloadAction<string | undefined>){
            state.loading = false;
            state.error = action.payload
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
            .addCase(manualAttendanceThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(manualAttendanceThunk.fulfilled,  (state : classState ) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(manualAttendanceThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
                state.loading = false;
                state.error = action.payload || "attendance not updated'"
            })
            .addCase(deleteClassThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteClassThunk.fulfilled,(state : classState ) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(deleteClassThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not deleted'
            })
    }
})

const {setClasses, setError, setPending} = classesSlice.actions

