import {useEffect , useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useParams} from "react-router-dom";
import {getDate} from "../Util/Naming_Conv.ts";
import _ , {isArray} from "lodash";
import {Class} from "../Model/classes.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {DatePicker , DateRangePicker} from 'rsuite';
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {data} from "autoprefixer";
import ExcelJS from "exceljs"
import {ExportExcel} from "../Component/exportExcel.ts";
import {DateRange} from "rsuite/DateRangePicker";
import {ScreenComponent} from "../Component/ScreenComponent.tsx";

export function SubjectPage() {

    // const [startDate, setStartDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | null>([new Date() , new Date()]);
    const params = useParams()
    const { classes } = useAppSelector(state => state.class)
    const { subject } = useAppSelector(state => state.subjectById)

    console.log(dateRange)

    let groupedClass

    const today = new Date()

    const dispatch = useAppDispatch()
    useEffect ( () => {
        dispatch(getClassesThunk({id : `${params.id}`}))
    } , [dispatch] );

    groupedClass = _.groupBy(classes.map(item=>({...item, month : getDate(item.createdOn).month})), 'month')

    console.log(JSON.stringify(groupedClass))

    useEffect ( () => {
        dispatch(getSubjectByIdThunk({id : params.id}))
    } , [] );


    function handleExport(){
        // const formattedDate = (date) => new Intl.DateTimeFormat('en-US').format(date);
        //         const diffTime = Math.abs(endDate-startDate)
        //         const diffDay = Math.floor(diffTime/(1000 * 60 * 60 * 24))
        //         // const dates = Math.floor(diffTime/(1000 * 60 * 60 * 24))
        //         const diff = formattedDate(endDate) - formattedDate(startDate)

        // const diff = Math.ceil((endDate-startDate)/(1000 * 60 * 60 * 24))
        //
        // console.log(diff)
        // const dateFormat  = {weekday:'short',month:'short',day:'numeric'}
        // const dates = Array.from(
        //     {length: diff},
        //     (_,i) => {
        //         const date  = startDate
        //         date?.setDate(startDate?.getDate()+1)
        //         // const [weekdayStr, dateStr] = date.toLocaleDateString('en-US',dateFormat).split(', ')
        //         // return new Intl.DateTimeFormat('en-US').format(date);
        //         return date?.toDateString()
        //     }
        // )

        let studentDates

        if (dateRange) {
            studentDates = classes.filter ( one_class =>
                (new Date ( one_class.createdOn ) > dateRange[0] && new Date ( one_class.createdOn ) < dateRange[1])
            )
        }

        ExportExcel( { studentDates : studentDates , subject : subject })

    }





    return (

        <ScreenComponent>
            <div className="h-full w-full flex flex-col    ">
                <div className="mb-20 flex flex-col gap-7">
                    <div>
                        <p className="text-lg text-gray-400">{subject.department} - {subject.section}</p>
                        <h4 className="text-6xl">{subject.title}</h4>
                    </div>
                    <div >
                        <p className="flex flex-col w-fit items-center"><span className="text-2xl">{classes.length}</span> <span className="text-xs text-gray-400">Classes</span></p>
                    </div>
                </div>

                <div  className="h-full w-full flex justify-between items-start gap-64 ">

                    {/*<h3>{params.id}</h3>*/}
                    <div className="flex flex-col gap-5">
                        {Object.keys(groupedClass).map((item)=>(
                            <>
                                <h3 className="text-lg font-bold">{item}</h3>
                                <div className="flex flex-row gap-5">
                                {groupedClass[item].map((data : Class)=>(
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
                        <DateRangePicker className="border-transparent focus:border-transparent focus:ring-0" style={{width: "40px"}} onChange={(date)=>setDateRange(date)} placement="auto" placeholder="Export" />
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

