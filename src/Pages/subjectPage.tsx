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
import { DatePicker } from 'rsuite';
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {data} from "autoprefixer";
import ExcelJS from "exceljs"

export function SubjectPage() {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const params = useParams()
    const { classes } = useAppSelector(state => state.class)
    const { subject } = useAppSelector(state => state.subjectById)

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

        const diff = Math.ceil((endDate-startDate)/(1000 * 60 * 60 * 24))

        console.log(diff)
        const dateFormat  = {weekday:'short',month:'short',day:'numeric'}
        const dates = Array.from(
            {length: diff},
            (_,i) => {
                const date  = startDate
                date?.setDate(startDate?.getDate()+1)
                // const [weekdayStr, dateStr] = date.toLocaleDateString('en-US',dateFormat).split(', ')
                // return new Intl.DateTimeFormat('en-US').format(date);
                return date?.toDateString()
            }
        )

        console.log(dates )


        classes.map(classs=>console.log(new Date(classs.createdOn).toDateString()))



        // const mockData = [
        //     // subject?.studentsEnrolled
        //     //     // .filter(student => dates.includes(classes)) // Ensure `dates` includes `classes`
        //     //     .map(student => (
        //     //         {
        //     //             Roll_num: `${student}`, // Convert student to string
        //     //             dates: `` // Add other necessary logic for `dates` if needed
        //     //         }
        //     //     )) || []
        //         classes.map(one_class=>
        //             dates.includes( new Date(one_class.createdOn).toDateString()) &&
        //             {
        //                 date : "p"
        //             }
        //         )
        //     ]

        let studentDates

        studentDates = classes.filter(one_class=>
            dates.includes(new Date(one_class.createdOn).toDateString())
        )

        const exportFile = () => {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("my sheet")
            sheet.properties.defaultRowHeight = 50


            sheet.columns = [
                {
                    header : "Roll Number",
                    key : 'roll',
                    width : 10
                },
            ...studentDates.map((date)=>(
                    {
                        header : new Intl.DateTimeFormat('en-US').format(date.createdOn)  ,
                        key : new Intl.DateTimeFormat('en-US').format(date.createdOn) ,
                        width : 10
                    }
                ))
            ]

            subject?.studentsEnrolled?.map(student=> {

                const rowData = {roll : student}

                studentDates?.map((date)=>{
                    const isPresent = date.attendees?.includes(student)
                    rowData[new Intl.DateTimeFormat('en-US').format(date.createdOn)] = isPresent ? "Present" : "Absent"
                    console.log(student , rowData[new Intl.DateTimeFormat('en-US').format(date.createdOn)])
                })

                console.log(rowData)

                sheet.addRow(rowData);

                // sheet.addRow (
                //     studentDates?.attendees?.includes(student) ?
                //     {
                //         roll : student ,
                //         date : "Present"
                //     }
                //     : {
                //         roll : student,
                //         date : "Absent"
                //     }
                // )
            })

            const writeFile = (fileName, content) => {
                const link = document.createElement("a");
                const blob = new Blob([content], {
                    type: "application/vnd.ms-excel;charset=utf-8;"
                });
                link.download = fileName;
                link.href = URL.createObjectURL(blob);
                link.click();
            };

            workbook.xlsx.writeBuffer().then(data=>{
                writeFile("attendance_sheet",data)
            })
            .catch((error) => {
                console.error("Error generating CSV:", error);
            });


        }


            // console.log(studentDates)

        exportFile()

        // const mockData = (subject?.studentsEnrolled || []).map(student=>{
        //
        //
        //     // studentDates =  classes.map(one_class=>
        //     //      dates.filter(date => date?.includes(new Date(one_class.createdOn).toDateString()))
        //     // )
        //
        //     studentDates.map(date=> {
        //         return {
        //             `roll_num` = student ,
        //             `${studentDates[0]}` = 0
        //         }
        //     })
        // })

        // const mock = [
        // dates.includes(classes) &&
        // [
        //     `${dates}` , "p"
        // ]
        //
        // ]

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

