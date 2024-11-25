import {useEffect , useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useParams} from "react-router-dom";
import department from "../Model/Department.ts";
import {getDate} from "../Util/Naming_Conv.ts";
import {getMonths} from "../Model/Months.ts";
import _ from "lodash";
import {Classes} from "../Model/classes.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export function SubjectPage() {

    const params = useParams()

    const { classArray } = useAppSelector(state => state.class)

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
    } , [] );

    function grouping(array : [], name : string){

    }

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const groupedClass = _.groupBy(classArray, 'title')

    console.log(groupedClass)

    function handleDateChange(date){
        setStartDate(date)
    }

    return (
        <>
            <div style={{backgroundColor:"pink"}} className="w-full h-full flex gap-64 ">
                {/*<h3>{params.id}</h3>*/}
                {Object.entries(groupedClass).map(([key,item])=>(
                    <div>
                        {/*<div>{groupedClass[key]}</div>*/}
                        <div>{key}</div>
                        {item.map((data : Classes)=>(
                            <ClassBlock classDate={data.createdOn}/>
                            // <div className="flex flex-col mt-10  ">
                            //     { getMonths(data.month) }
                            //     <div className="btn btn-secondary w-fit flex mt-5 flex-col ">
                            //         <span>{data.date}</span>
                            //         <span>{getMonths(data.month)}</span>
                            //     </div>
                            // </div>
                        ))}
                    </div>
                ))}

                <button className="btn btn-primary">Export</button>

                <div className="flex flex-col gap-10">
                    <button  className="btn btn-primary flex flex-col">
                        <span>Starting Date</span>
                        <DatePicker className="bg-white " popperPlacement="right" onSelect={()=>setStartDate(startDate)} selected={startDate} onChange={(date) => setStartDate(date)} />
                    </button>
                    <button  className="btn btn-primary flex flex-col">
                        <span>End Date</span>
                        <DatePicker className="bg-white" popperPlacement="left" onSelect={(date)=>handleDateSelect(date)} selected={endDate} onChange={(date) => setEndDate(date)} />
                    </button>
                </div>




                {/*{classArray.map(item=> {*/}
                {/*    // console.log(item.department)*/}
                {/*    const date = getDate(item.createdOn)*/}
                {/*    return (*/}
                {/*        <div className="w-full h-full container mx-auto">*/}
                {/*            <h1 className="text-ghost">{ item.department } - { item.section }</h1>*/}
                {/*            <h3 className="text-3xl">{ item.title }</h3>*/}
                {/*            <div className="flex flex-col mt-10  ">*/}
                {/*                { getMonths(date.month) }*/}
                {/*                <div className="btn btn-secondary w-fit flex mt-5 flex-col ">*/}
                {/*                    <span>{date.date}</span>*/}
                {/*                    <span>{getMonths(date.month)}</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        )*/}
                {/*})}*/}
            </div>
        </>
    );
}

