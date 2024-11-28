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
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";

export function SubjectPage() {

    const params = useParams()

    const { classArray } = useAppSelector(state => state.class)
    const { subjects } = useAppSelector(state => state.subjectById)

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
        dispatch(getSubjectByIdThunk({id : `${params.id}`}))
    } , [dispatch] );

    function grouping(array : [], name : string){

    }

    console.log(subjects)

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    let groupedClass

    const classname = classArray.map(item=>({...item, month : getMonths(getDate(item.createdOn).month)}))

    // console.log(classname)


    groupedClass = _.groupBy(classname, 'month')

    // console.log(date)

    console.log(JSON.stringify(groupedClass))

    function handleDateChange(date){
        setStartDate(date)
    }

    return (
        <>
            <div  className="w-full h-full flex  gap-64 ">
                {/*<h3>{params.id}</h3>*/}
                <div className="flex flex-col gap-8">
                    {Object.keys(groupedClass).map((item)=>(
                        <>
                            <h3 className="text-lg font-bold">{item}</h3>
                            <div className="flex flex-row gap-5">
                            {groupedClass[item].map((data : Classes)=>(
                                <ClassBlock classInfo={data}/>
                                // <div className="flex flex-col mt-10  ">
                                //     { getMonths(data.month) }
                                //     <div className="btn btn-secondary w-fit flex mt-5 flex-col ">
                                //         <span>{data.date}</span>
                                //         <span>{getMonths(data.month)}</span>
                                //     </div>
                                // </div>
                            ))}
                            </div>
                        </>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-5">
                        <button  className="btn btn-secondary flex flex-col">
                            <span>Starting Date</span>
                            <DatePicker className="bg-white " popperPlacement="right" onSelect={()=>setStartDate(startDate)} selected={startDate} onChange={(date) => setStartDate(date)} />
                        </button>
                        <button  className="btn btn-secondary flex flex-col">
                            <span>End Date</span>
                            <DatePicker className="bg-white" popperPlacement="left" onSelect={(date)=>setEndDate(date)} selected={endDate} onChange={(date) => setEndDate(date)} />
                        </button>
                    </div>
                    <button className="btn btn-secondary ">Export</button>
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

