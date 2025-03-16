import {createAsyncThunk , createSlice , PayloadAction} from "@reduxjs/toolkit";
import { database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";

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
            // .get()
            // .then((result)=>{
            //     return result.data() as Class
            // }).then((classes)=>{
            //     console.log(classes)
            //     return classes
            // })
            // .catch(error=>{
            //     return rejectWithValue(error)
            // })
    }
)

export const manualAttendanceThunk = createAsyncThunk<
    void,
    {id : string, attendanceField : string, roll : string},
    {rejectValue : string}
>(
    "class/manualAttendance",
    async ({id, attendanceField,roll}, {rejectWithValue})=>{

        console.log(id)

        const classDoc = await database.collection("classes").doc(`${id}`)


        return await classDoc.get().then((result)=>{
            return result.data() as Class
        }).then((result)=>{
            if(attendanceField === "Present" ) {
                return classDoc.update ( {
                    ...result,
                    attendees : result?.attendees ?  [...result?.attendees,  roll ] : [roll]

                } ).then ( () => console.log ( "doc updated successfully" ) )
                    .catch ( error => {
                        return rejectWithValue ( error.message )
                    } )
            }
            else return classDoc.update( {
                attendees : result?.attendees?.filter((items)=>items!=roll)
            }).then(()=>console.log("doc updated successfully"))
                .catch(error=> {
                    return rejectWithValue ( error.message )
                })
        })
            .catch(error=>{return rejectWithValue(error.message)})


        // if(attendanceField === "Present" ){
        //     classDoc.get().then((result)=>{
        //         return result.data() as Class
        //     }).then((result)=>{
        //         if (!result.attendees.includes(roll)) return classDoc.update({
        //             attendees : result.attendees.push(roll)
        //         }).then(()=>console.log("doc updated successfully"))
        //             .catch(error=> {
        //                 return rejectWithValue ( error )
        //             })
        //     })
        // }
        // else {
        //
        // }

        // return database.collection("classes").doc(`${id}`)
        //     .set((prevState)=>{
        //         ...prevState,
        //
        //     })
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
            .then(()=>console.log("class deleted successfully"))
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
            // .addCase(getClassByIdThunk.pending,(state : classState ) => {
            //     state.loading = true;
            //     state.error = null
            // })
            // .addCase(getClassByIdThunk.fulfilled,(state : classState, action : PayloadAction<Class> ) => {
            //     state.loading = false;
            //     state.error = null;
            //     state.classes = action.payload
            // })
            // .addCase(getClassByIdThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
            //     state.loading = false;
            //     state.error = action.payload || 'class not found'
            // })
            .addCase(manualAttendanceThunk.pending,(state : classState ) => {
                state.loading = true;
                state.error = null
            })
            .addCase(manualAttendanceThunk.fulfilled,(state : classState ) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(manualAttendanceThunk.rejected,(state : classState, action : PayloadAction<string | undefined> ) => {
                state.loading = false;
                state.error = action.payload || 'class not found'
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

