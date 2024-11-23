import {useEffect , useState} from "react";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useParams} from "react-router-dom";

export function SubjectPage() {

    const params = useParams()

    console.log(params.id)

    const { classArray } = useAppSelector(state => state.class)

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
    } , [] );

    return (
        <>
            <div className="nav border-b-2 p-3 border-gray-200 shadow-md shadow-gray-100 ">
                <div className="flex flex-row  justify-between  ">
                    <h3 ></h3>
                    <p>profile</p>
                </div>
            </div>
            <div>

                <h3>{params.id}</h3>
            </div>
        </>
    );
}

