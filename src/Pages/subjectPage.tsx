import {useEffect , useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useParams} from "react-router-dom";
import {getDate} from "../Util/Naming_Conv.ts";
import _ from "lodash";
import {Class} from "../Model/classes.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { DatePicker } from 'rsuite';
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";

export function SubjectPage() {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const params = useParams()
    const { classes } = useAppSelector(state => state.class)
    let groupedClass

    const today = new Date()

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
    } , [dispatch] );

    groupedClass = _.groupBy(classes.map(item=>({...item, month : getDate(item.createdOn).month})), 'month')

    console.log(JSON.stringify(groupedClass))

    useEffect ( () => {
        dispatch(getSubjectByIdThunk({id : classes.subjectId}))
    } , [classes] );


    function handleExport(){
        const csvData = [
            ["Roll Number",[endDate-startDate].map(date=>date)]
        ]
        console.log(csvData)
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
                            {groupedClass[item].map((data : Class)=>(
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

                {/*<Datepicker  />*/}

                <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-5">
                        <button  className="btn btn-secondary flex flex-col">
                            <span>Starting Date</span>
                            {/*<DatePicker className="bg-white " popperPlacement="right" onSelect={()=>setStartDate(startDate)} selected={startDate} onChange={(date) => setStartDate(date)} />*/}
                            <DatePicker onSelect={()=>setStartDate(startDate)} onChange={(date) => {
                                date<endDate && setStartDate ( date )
                            }} format="dd.MM.yyyy" value={startDate} />
                        </button>
                        <button  className="btn btn-secondary flex flex-col">
                            <span>End Date</span>
                            {/*<DatePicker className="bg-white" popperPlacement="left" onSelect={(date)=>setEndDate(date)} selected={endDate} onChange={(date) => setEndDate(date)} />*/}
                            <DatePicker onSelect={(date)=>setEndDate(endDate)} onChange={(date) => {
                                date<today && setEndDate ( date )
                            }} format="dd.MM.yyyy" value={endDate} />
                        </button>
                    </div>
                    <button className="btn btn-secondary " onClick={handleExport}>Export</button>
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

