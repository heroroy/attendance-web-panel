import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useParams} from "react-router-dom";
import department from "../Model/Department.ts";
import {getDate} from "../Util/Naming_Conv.ts";
import {getMonths} from "../Model/Months.ts";

export function SubjectPage() {

    const params = useParams()

    const { classArray } = useAppSelector(state => state.class)

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
    } , [] );

    console.log(classArray)


    return (
        <>
            <div className="w-full h-full ">
                {/*<h3>{params.id}</h3>*/}
                {classArray.map(item=> {
                    // console.log(item.department)
                    const date = getDate(item.createdOn)
                    return (
                        <div className="w-full h-full container mx-auto">
                            <h1 className="text-ghost">{ item.department } - { item.section }</h1>
                            <h3 className="text-3xl">{ item.title }</h3>
                            <div className="flex flex-col mt-10  ">
                                { getMonths(date.month) }
                                <div className="btn btn-secondary w-fit flex mt-5 flex-col ">
                                    <span>{date.date}</span>
                                    <span>{getMonths(date.month)}</span>
                                </div>
                            </div>
                        </div>
                        )
                })}
            </div>
        </>
    );
}

