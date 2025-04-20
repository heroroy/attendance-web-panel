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
import Toast from "../Util/Toast.ts";
import SubjectDataStore from "../data/SubjectDatastore.ts";
import {MdDeleteOutline} from "react-icons/md";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";

export function SubjectPage() {
    const params = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    const {classes, classloading: classLoading, classError: classError} = useAppSelector(state => state.class)
    const {subject, loading: subjectLoading, error: subjectError} = useAppSelector(state => state.subjectById)
    const {
        users,
        error: usersError
    } = useAppSelector(state => state.userById)

    const user = _.groupBy(users, 'id')


    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);


    useEffect(() => {
        if (!params.id) {
            navigate(-1)
            return
        }

        dispatch(getSubjectByIdThunk({id: params.id}))
        dispatch(getClassesThunk({id: `${params.id}`}))
    }, [dispatch, navigate, params.id]);

    useEffect(() => {
        if (!subject) return

        dispatch(getUsersByIdsThunk({id: subject.studentsEnrolled}))
    }, [dispatch, subject]);

    const [avgAttendance, setAvgAttendance] = useState(0)
    const [isSubjectDeleting, setIsSubjectDeleting] = useState(false)

    useEffect(() => {
        if (!subject || !isArray(classes) || classes.length === 0) return

        const enrolledStudentCount = subject.studentsEnrolled.length

        const avgAttendancePerClass = classes.map(classData => (classData.attendees?.length || 0) / enrolledStudentCount * 100)

        let averageAttendance = _.sum(avgAttendancePerClass) / classes.length
        averageAttendance = (Math.round(averageAttendance + Number.EPSILON) / 100) * 100

        setAvgAttendance(averageAttendance)
    }, [classes, subject]);


    const groupedClass = _.groupBy(Object.keys(classes).map((item) => ({
        ...(classes[item as keyof typeof classes] as Class),
        month: getDate((classes[item as keyof typeof classes] as Class).createdOn).month
    })), 'month')

    async function deleteSubject() {
        if (!subject) return;
        const subjectId = subject.id


        if (!confirm(`Are you sure you want to delete this subject? This action is permanent`))
            return

        setIsSubjectDeleting(true)
        await SubjectDataStore.deleteSubject(subjectId)
            .then(() => navigate(-1))
            .catch(() => Toast.showError("Failed to delete subject"))
            .finally(() => setIsSubjectDeleting(false))

    }


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
        }).sort((data1, data2)=>data1.createdOn - data2.createdOn)

        console.log(user)

        exportAttendance({classes: classesInRange, subject: subject, students : user})
            .then(() => Toast.showSuccess("Attendance Exported"))
            .catch(() => Toast.showError("Error Exporting Attendance"))

        setDateRange(null)
    }

    const [screenState, setScreenState] = useState(ScreenState.LOADING)
    const [errorState, setErrorState] = useState<string | null>()

    useEffect(() => {
        if (subjectLoading || classLoading) {
            setScreenState(ScreenState.LOADING)
        } else if (subjectError || classError || usersError) {
            setScreenState(ScreenState.ERROR)
            setErrorState(subjectError || classError || usersError)
        } else setScreenState(ScreenState.SUCCESS)
    }, [subjectLoading, classLoading, subjectError, classError]);

    return (
        <ScreenComponent error={errorState} state={screenState}>
            <div className="h-screen w-full flex flex-col">
                <div className="mb-20 flex flex-col gap-8 lg:gap-16">
                    <div className='flex flex-row w-full justify-between'>
                        <div className='flex flex-col'>
                            <p className="text-xl lg:text-2xl text-neutral-500">{subject?.department}</p>
                            <p className="text-xl lg:text-xl text-neutral-400">Sem {subject?.semester} - {subject?.section}</p>
                            <h4 className="text-3xl lg:text-5xl mt-8">{subject?.title}</h4>
                        </div>

                        <button
                            className={`btn btn-sm ${isSubjectDeleting ? 'btn-disabled' : 'btn-error'}`}
                            disabled={isSubjectDeleting} onClick={deleteSubject}
                        >
                            {
                                isSubjectDeleting
                                    ? <span className="loading loading-spinner loading-xs"/>
                                    : <MdDeleteOutline size='1.2rem'/>
                            }
                            Delete
                        </button>

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

