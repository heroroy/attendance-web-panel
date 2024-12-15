import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useNavigate, useParams} from "react-router-dom";
import {getDate} from "../Util/Naming_Conv.ts";
import _, {isArray} from "lodash";
import {Class} from "../Model/classes.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {DateRangePicker} from 'rsuite';
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {DateRange} from "rsuite/DateRangePicker";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";
import {exportAttendance} from "../Component/exportAttendance.ts";

export function SubjectPage() {
    const params = useParams()

    // const [startDate, setStartDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | null>([new Date(), new Date()]);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {classes, loading: classLoading, error: classError} = useAppSelector(state => state.class)
    const {subject, loading: subjectLoading, error: subjectError} = useAppSelector(state => state.subjectById)

    const groupedClass = _.groupBy(classes.map(item => ({...item, month: getDate(item.createdOn).month})), 'month')

    useEffect(() => {
        if (!params.id) {
            navigate(-1)
            return
        }

        dispatch(getSubjectByIdThunk({id: params.id}))
        dispatch(getClassesThunk({id: `${params.id}`}))
    }, [dispatch, params.id]);

    async function handleExport() {
        if (!dateRange) {
            alert("Select both dates")
            return
        }
        if (!isArray(classes) || !subject) {
            return
        }
        const startDate = dateRange[0]
        const endDate = dateRange[1]

        startDate.setHours(0, 0, 0) //12am of start day
        endDate.setHours(23, 59, 59) //11:59pm of end day

        const classesInRange = classes.filter(classInfo => {
            const classDate = new Date(classInfo.createdOn)
            return classDate >= startDate && classDate <= endDate
        })

        exportAttendance({classes: classesInRange, subject: subject})
            .then(() => alert("Attendance Exported"))
            .catch(() => alert("Error Exporting Attendance"))
    }

    let screenState: ScreenState

    if (subjectError || classError) {
        screenState = ScreenState.ERROR
    } else if (subjectLoading || classLoading) {
        screenState = ScreenState.LOADING
    } else screenState = ScreenState.SUCCESS

    return (
        <ScreenComponent state={screenState}>
            <div className="h-full w-full flex flex-col">
                <div className="mb-20 flex flex-col gap-7">
                    <div>
                        <p className="text-lg text-gray-400">{subject?.department} - {subject?.section}</p>
                        <h4 className="text-6xl">{subject?.title}</h4>
                    </div>
                    <div>
                        <p className="flex flex-col w-fit items-center"><span
                            className="text-2xl">{classes.length}</span> <span
                            className="text-xs text-gray-400">Classes</span></p>
                    </div>
                </div>

                <div className="h-full w-full flex justify-between items-start gap-64 ">

                    {/*<h3>{params.id}</h3>*/}
                    <div className="flex flex-col gap-5">
                        {Object.keys(groupedClass).map((item) => (
                            <>
                                <h3 className="text-lg font-bold">{item}</h3>
                                <div className="flex flex-row gap-5">
                                    {groupedClass[item].map((data: Class) => (
                                        <ClassBlock classInfo={data}/>
                                    ))}
                                </div>
                            </>
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
                        <DateRangePicker className="border-transparent focus:border-transparent focus:ring-0"
                                         style={{width: "40px"}} onChange={(date) => setDateRange(date)}
                                         placement="auto" placeholder="Export"/>
                        <button className="btn bg-slate-600 btn-sm " onClick={handleExport}>Export</button>
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

