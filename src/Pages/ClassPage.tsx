import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {useEffect} from "react";
import {getClassByIdThunk} from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import _, {isArray} from "lodash";
import {formatDate} from "../Util/Naming_Conv.ts";
import {exportAttendance} from "../Util/exportAttendance.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";
import User from "../Model/User.ts";
import {getDepartmentShort} from "../Model/Department.ts";

export function ClassPage() {

    const params = useParams()

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {classes, loading: classLoading, error: classError} = useAppSelector(state => state.class)
    const {subject, loading: subjectLoading, error: subjectError} = useAppSelector(state => state.subjectById)
    const {users, loading: usersLoading, error: usersError} = useAppSelector(state => state.userById)
    const {subjects} = useAppSelector(state => state.subject)

    console.log(subjects)

    useEffect(() => {
        if (!params.id) {
            navigate(-1)
            return
        }
        dispatch(getClassByIdThunk({id: params.id}))
    }, [navigate, params.id, dispatch]);

    useEffect(() => {
        if (!classes || isArray(classes)) return

        dispatch(getSubjectByIdThunk({id: classes.subjectId}))
    }, [dispatch, classes]);


    useEffect(() => {
        if (!subject) return

        dispatch(getUsersByIdsThunk({id: subject.studentsEnrolled}))
    }, [dispatch, subject]);

    const user = _.groupBy(users, 'id')

    function exportFunc() {
        if (isArray(classes) || !subject) return

        exportAttendance({classes: [classes], subject: subject})
            .then(() => alert("Attendance Exported"))
            .catch(() => alert("Error Exporting Attendance"))
    }

    if (!classes || isArray(classes))
        return <h1>Loading...</h1>

    let screenState: ScreenState

    if (subjectError || classError || usersError) screenState = ScreenState.ERROR
    else if (subjectLoading || classLoading || usersLoading) screenState = ScreenState.LOADING
    else screenState = ScreenState.SUCCESS

    const department = subject ? getDepartmentShort(subject.department) : 'null'

    return (
        <ScreenComponent state={screenState}>
            <div className='flex flex-col gap-16 w-full'>


                <div className='flex flex-col'>
                    <p className='text-xl lg:text-3xl text-neutral-500'>{subject?.title} - {department}</p>
                    <p className='text-xl lg:text-2xl text-neutral-400'>Sem {subject?.semester} - {subject?.section}</p>

                    <div className="flex items-center justify-between w-full mt-8">
                        <h4 className="text-3xl lg:text-5xl">{formatDate(new Date(classes?.createdOn))}</h4>
                        <button
                            className="btn btn-primary hover:bg-secondary px-8 btn-md"
                            onClick={exportFunc}
                        >
                            Export
                        </button>
                    </div>
                </div>
                <table
                    className="table-auto border-collapse border gap-3 bg-primary text-primary-content border-slate-500 w-full h-full">
                    <thead>
                    <tr className="h-12 text-base">
                        <th className="border border-slate-600">Sl No.</th>
                        <th className="border border-slate-600">Roll No.</th>
                        <th className="border border-slate-600">Name</th>
                        <th className="border border-slate-600">Attendance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subject?.studentsEnrolled?.map((item, index) => (
                        <AttendeeRow index={index} roll={item} user={user[item] && user[item][0]}
                                     isPresent={classes.attendees.includes(item)}/>
                    ))}
                    </tbody>
                </table>
            </div>

        </ScreenComponent>

    );
}

interface AttendeeRowProps {
    index: number,
    roll: string,
    user?: User,
    isPresent: boolean
}

const AttendeeRow = ({index, roll, user, isPresent}: AttendeeRowProps) => {
    const bgColor = index % 2 === 0 ? "bg-base-100" : "bg-base-200"

    return (
        <tr key={index} className={`text-base h-6 text-base-content ${bgColor}`}>
            <td className="border border-slate-600 text-center p-4">{index + 1}</td>
            <td className="border border-slate-600 text-center p-4">{roll}</td>
            <td className="border border-slate-600 text-center p-4">{user?.name || "-"}</td>
            <td className={`border border-slate-600 text-center p-4 font-semibold ${isPresent ? 'text-green-600' : 'text-red-600'}`}>{isPresent ? "Present" : "Absent"}</td>
        </tr>
    )
}