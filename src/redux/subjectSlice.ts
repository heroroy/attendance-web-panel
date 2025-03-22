import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {database} from "../firebase.ts";
import Subject from "../Model/Subject.ts";
import {deleteDoc , query, where, collection, getDocs} from "firebase/firestore";
import {toast} from "react-toastify";


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
            .catch(error => {
                console.error("error", error)
                rejectWithValue(error)
            })
    }
)

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
            .onSnapshot((querySnapshot) => {
                console.log("Snapshot =", querySnapshot.docs)
                dispatch(setSubjects(querySnapshot.docs.map(doc => doc.data() as Subject)))
                // resolve(sub)
            }, (error) => {
                console.error("Error fetching subjects:", error);
                dispatch(setError(error.message))
            })
    }
)

export const deleteSubjectThunk = createAsyncThunk<
    void,
    { id: string },
    {rejectValue : string}
>(
    "subject/delete",
    async ({ id }, { rejectWithValue }) => {

        return await database.collection("subjects").doc(`${id}`)
            .delete()
            .then( async ()=> {
                console.log ( "subject deleted successfully" )
                setTimeout(()=>{
                    toast("subject deleted successfully",{
                        type : "success",
                        theme : "colored",
                        position : "top-center",
                        draggable: true,
                        autoClose : 2000,

                    })
                },200)

                const unstub = await getDocs ( query ( collection ( database , "classes" ) , where ( "subjectId" , '==' , `${ id }` ) ) )

                unstub.forEach((doc)=>{
                    deleteDoc(doc.ref)
                        .then(()=> {
                            console.log ( "classes deleted successfully" )
                            setTimeout(()=>{
                                toast("classes deleted successfully",{
                                    type : "success",
                                    theme : "colored",
                                    position : "top-center",
                                    draggable: true,
                                    autoClose : 2000,
                                })
                            },400)
                        })
                        .catch(error=>{return rejectWithValue(error)})
                })



            })
            .catch((error)=> {
                 return rejectWithValue ( error.message )
            })
    }
)


export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setPending(state: subjectState) {
            state.loading = true;
            state.error = null;
        },
        setSubjects(state: subjectState, action: PayloadAction<Subject[]>) {
            state.loading = false;
            state.error = null;
            state.subjects = action.payload;
        },
        setError(state: subjectState, action: PayloadAction<string | undefined>) {
            state.loading = false;
            state.error = action.payload || "Subject not found";
        },
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
            .addCase(deleteSubjectThunk.pending, (state: subjectState) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteSubjectThunk.fulfilled, (state: subjectState) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(deleteSubjectThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'subject not deleted'
            })
    }
})

const {setSubjects, setError, setPending} = subjectSlice.actions
