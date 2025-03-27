import {configureStore} from "@reduxjs/toolkit";
import {profileSlice} from "./profileSlice.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {subjectSlice} from "./subjectSlice.ts";
import {classesSlice} from "./classesSlice.ts";
import {subjectByIdSlice} from "./getSubjectById.ts";
import {userByIdSlice} from "./userSlice.ts";

export const store = configureStore({
    reducer: {
        auth: profileSlice.reducer,
        subject: subjectSlice.reducer,
        class: classesSlice.reducer,
        subjectById: subjectByIdSlice.reducer,
        userById: userByIdSlice.reducer
    },
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

