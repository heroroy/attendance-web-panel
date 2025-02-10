import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getClassesThunk} from "../redux/classesSlice.ts";
import {useNavigate, useParams} from "react-router-dom";
import {getDate} from "../Util/Naming_Conv.ts";
import _, {isArray, size} from "lodash";
import {Class} from "../Model/Class.ts";
import {ClassBlock} from "../Component/ClassBlock.tsx";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {DateRangePicker} from 'rsuite';
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

    useEffect ( () => {
        window.scrollTo(0,0)
    } , [] );


    useEffect(() => {
        if (!params.id) {
            navigate(-1)
            return
        }

        dispatch(getSubjectByIdThunk({id: params.id}))
        dispatch(getClassesThunk({id: `${params.id}`}))
    }, [dispatch, navigate, params.id]);

    const [avgAttendance, setAvgAttendance] = useState(0)

    useEffect(() => {
        if (!subject || !isArray(classes) || classes.length === 0) return

        const enrolledStudentCount = subject.studentsEnrolled.length

        const avgAttendancePerClass = classes.map(classData=> (classData.attendees?.length || 0) / enrolledStudentCount * 100)

        let averageAttendance = _.sum( avgAttendancePerClass) / classes.length
        console.log(averageAttendance)
        // averageAttendance = Math.round((averageAttendance + Number.EPSILON) * 100) / 100
        averageAttendance = (Math.round(averageAttendance + Number.EPSILON ) / 100) * 100
        console.log(averageAttendance)

        setAvgAttendance(averageAttendance)
    }, [classes, subject]);

    if (!classes || !(classes as Class))
        return <h1>Loading...</h1>


    const groupedClass = _.groupBy(Object.keys(classes).map((item) => ({
        ...(classes[item as keyof typeof classes] as Class),
        month: getDate((classes[item as keyof typeof classes] as Class).createdOn).month
    })), 'month')


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
                <div className="mb-20 flex flex-col gap-8 lg:gap-16">
                    <div className='flex flex-col gap-4'>
                        <p className="text-xl lg:text-2xl text-neutral-500">{subject?.department} - {subject?.section}</p>
                        <h4 className="text-3xl lg:text-5xl">{subject?.title}</h4>
                    </div>

                    <div className="flex flex-row w-full justify-between">
                        <div className='flex flex-row gap-16 items-center'>
                            <p className="flex flex-col items-center"><span
                                className="text-4xl">{size(classes)}</span> <span
                                className="text-xl text-neutral-500">Classes</span>
                            </p>
                            <p className="flex flex-col items-center"><span
                                className="text-4xl">{avgAttendance}%</span> <span
                                className="text-xl text-gray-500">Avg Attendance</span>
                            </p>
                        </div>
                        {size(classes) > 0 &&
                            <div className="flex rounded-xl justify-self-start px-1 items-center gap-1">
                                <DateRangePicker
                                    className="border-transparent focus:border-transparent focus:ring-0"
                                     onChange={setDateRange}
                                    placement="auto" placeholder="Export"/>
                                <button className="btn btn-primary btn-sm" onClick={handleExport}>Export</button>
                            </div>}
                    </div>
                </div>

                <div className="h-full w-full flex justify-between items-start gap-64 ">

                    <div className="flex flex-col gap-8">
                        {Object.keys(groupedClass).map((item, index) => (
                            <div key={index} className='flex flex-col gap-4'>
                                <p className="text-xl font-semibold">{item}</p>
                                <div key={index} className="flex flex-row gap-2">
                                    {groupedClass[item].map((data: Class) => (
                                        <div key={data?.id}><ClassBlock classInfo={data}/></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ScreenComponent>

    );
}

