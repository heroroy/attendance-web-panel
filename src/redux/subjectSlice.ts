import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { database} from "../firebase.ts";
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
    Subject ,
    { rejectValue: string }
>(
    'subject/add',
    async (subject: Subject  ,{rejectWithValue}) => {
        await database.collection("subjects")
            .doc(subject.id)
            .set(subject)
            .then(() => {
                console.log ( "inserted" )
            })
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
    async ({ userId }, { dispatch}) => {
        // const fetchSubjects = async (): Promise<Subject[]> => {

        // let subjects   = []

            // return new Promise((resolve, reject) => {
                    dispatch(setPending())
                    await database.collection("subjects")
                    .where('createdBy', '==', `${userId}`)
                    .orderBy('created', 'desc')
                    .onSnapshot((querySnapshot)=>{
                        dispatch(setSubjects(querySnapshot.docs.map(doc => doc.data() as Subject)))
                        // resolve(sub)
                    },(error) => {
                        console.error("Error fetching subjects:", error);
                        dispatch(setError(error.message))
                        // reject(rejectWithValue(error))
                        // return rejectWithValue(error)
                    })
            // })

        // return subjects

            // .then((subjects)=>{
            //     console.log("Subjects = " + JSON.stringify(subjects))
            //     return subjects
            // })
            // .catch(error=>{
            //     rejectWithValue(error)
            // })
        // };

        // console.log(subjects)
        //
        // return


        // return await fetchSubjects()
        //     .then((subjects)=>{
        //         console.log("Subjects = " + JSON.stringify(subjects))
        //         return subjects
        //     })
        //     .catch(error=>{
        //         rejectWithValue(error())
        //     })

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


    }
)

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setPending(state : subjectState) {
            state.loading = true;
            state.error = null;
        },
        setSubjects(state : subjectState, action: PayloadAction<Subject[]>) {
            state.loading = false;
            state.error = null;
            state.subjects = action.payload;
        },
        setError(state : subjectState, action: PayloadAction<string | undefined>) {
            state.loading = false;
            state.error = action.payload;
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
            // .addCase(getSubjectThunk.pending, (state: subjectState) => {
            //     state.loading = true;
            //     state.error = null
            // })
            // .addCase(getSubjectThunk.fulfilled, (state: subjectState, action: PayloadAction<Subject[]>) => {
            //     state.loading = false;
            //     state.error = null;
            //     state.subjects = action.payload
            // })
            // .addCase(getSubjectThunk.rejected, (state: subjectState, action: PayloadAction<string | undefined>) => {
            //     state.loading = false;
            //     state.error = action.payload || 'subject not created'
            // })
    }
})

const {setSubjects, setError, setPending} = subjectSlice.actions
