import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useNavigate, useParams} from "react-router-dom";
import {getDate} from "../Util/Naming_Conv.ts";
import _ , { isArray , size} from "lodash";
import {Class} from "../Model/classes.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { DateRangePicker} from 'rsuite';
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";
import {exportAttendance} from "../Util/exportAttendance.ts";
import {DateRange} from "rsuite/DateRangePicker";

export function SubjectPage() {
    const params = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    const {classes, loading: classLoading, error: classError} = useAppSelector(state => state.class)
    const {subject, loading: subjectLoading, error: subjectError} = useAppSelector(state => state.subjectById)

    if(!classes || !(classes as Class) )
        return <h1>Loading...</h1>


    const groupedClass = _.groupBy(Object.keys(classes).map((item) => ({...(classes[item as keyof typeof classes] as  Class), month: getDate((classes[item as keyof typeof classes] as Class).createdOn).month})), 'month')

    useEffect(() => {
        if (!params.id) {
            navigate(-1)
            return
        }

        dispatch(getSubjectByIdThunk({id: params.id}))
        dispatch(getClassesThunk({id: `${params.id}`}))
    }, [dispatch, params.id]);

    async function handleExport() {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            alert("Select both dates")
            return
        }
        if (!isArray(classes) || !subject) {
            return
        }
        const startDate = dateRange[0]
        const endDate = dateRange[1]

        startDate?.setHours(0, 0, 0) //12am of start day
        endDate?.setHours(23, 59, 59) //11:59pm of end day

        const classesInRange = classes.filter(classInfo => {
            const classDate = new Date(classInfo.createdOn)
            return classDate >= startDate && classDate <= endDate
        })

        exportAttendance({classes: classesInRange, subject: subject})
            .then(() => alert("Attendance Exported"))
            .catch(() => alert("Error Exporting Attendance"))

        setDateRange(null)
    }

    let screenState: ScreenState

    if (subjectError || classError) {
        screenState = ScreenState.ERROR
    } else if (subjectLoading || classLoading) {
        screenState = ScreenState.LOADING
    } else screenState = ScreenState.SUCCESS

    return (
        <ScreenComponent state={screenState}>
            <div className="h-screen w-full flex flex-col">
                <div className="mb-20 flex flex-col gap-7">
                    <div>
                        <p className="text-lg text-gray-400">{subject?.department} - {subject?.section}</p>
                        <h4 className="text-6xl">{subject?.title}</h4>
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <p className="flex flex-col w-fit items-center"><span
                            className="text-2xl">{size(classes)}</span> <span
                            className="text-xs text-gray-400">Classes</span>
                        </p>
                        {size(classes) >0 && <div className="flex rounded-xl justify-self-start bg-gray-500 px-1 items-center  gap-1">
                            <DateRangePicker
                                className="border-transparent bg-gray-500 focus:border-transparent focus:ring-0"
                                style={ { width : "40px" } } onChange={ setDateRange }
                                placement="auto" placeholder="Export"/>
                            <button className="btn bg-slate-600 btn-sm " onClick={ handleExport }>Export</button>
                        </div> }
                    </div>
                </div>

                <div className="h-full w-full flex justify-between items-start gap-64 ">

                    {/*<h3>{params.id}</h3>*/}
                    <div className="flex flex-col gap-5">
                        {Object.keys(groupedClass).map((item, index) => (
                            <div key={index}>
                                <p className=" font-light mb-1">{item}</p>
                                <div key={index} className="flex flex-row gap-2">
                                    {groupedClass[item].map((data: Class) => (
                                        <div key={data?.id}><ClassBlock classInfo={data}/></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*<Datepicker  />*/}

                    <div className="flex justify-self-start bg-gray-300 px-1 items-center  gap-1">
                        {/*<div className="flex flex-col gap-5">*/}
                        {/*    <button  className="btn btn-secondary flex flex-col">*/}
                        {/*        <span>Starting Date</span>*/}
                        {/*        /!*<DatePicker className="bg-white " popperPlacement="right" onSelect={()=>setStartDate(startDate)} selected={startDate} onChange={(date) => setStartDate(date)} />*!/*/}
                        {/*        <DatePicker onSelect={()=>setStartDate(startDate)} onChange={(date) => {*/}
                        {/*            date<endDate && setStartDate ( date )*/}
                        {/*        }} format="dd.MM.yyyy" value={startDate} />*/}
                        {/*    </button>*/}
                        {/*    <button  className="btn btn-secondary flex flex-col">*/}
                        {/*        <span>End Date</span>*/}
                        {/*        /!*<DatePicker className="bg-white" popperPlacement="left" onSelect={(date)=>setEndDate(date)} selected={endDate} onChange={(date) => setEndDate(date)} />*!/*/}
                        {/*        <DatePicker onSelect={(date)=>setEndDate(endDate)} onChange={(date) => {*/}
                        {/*            date<today && setEndDate ( date )*/}
                        {/*        }} format="dd.MM.yyyy" value={endDate} />*/}
                        {/*    </button>*/}
                        {/*</div>*/}

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
            </div>
        </ScreenComponent>

    );
}

