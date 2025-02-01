import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {useEffect} from "react";
import {getClassByIdThunk} from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import _, {isArray} from "lodash";
import {capitalizeWords, formatDate} from "../Util/Naming_Conv.ts";
import {exportAttendance} from "../Util/exportAttendance.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";

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

    return (
        <ScreenComponent state={screenState}>

            <div className='flex flex-col gap-16 w-full'>

                <div className="flex items-center justify-between w-full">
                    <div className='flex flex-col gap-4'>
                        <p className='text-xl lg:text-2xl text-gray-400'>{subject?.title} - {capitalizeWords(subject?.department ?? "")} {subject?.section}</p>
                        <h4 className="text-3xl lg:text-5xl">{formatDate(new Date(classes?.createdOn))}</h4>
                    </div>
                    <div>
                        <button className="btn bg-blue-600 hover:bg-blue-800 px-8" onClick={exportFunc}>Export</button>
                    </div>
                </div>
                <table className="table-auto border-collapse border gap-3 text-gray-300 bg-gray-700 border-slate-500 w-full h-full">
                    <thead>
                    <tr className="h-12">
                        <th className="border border-slate-600">Sl No.</th>
                        <th className="border border-slate-600">Roll No.</th>
                        <th className="border border-slate-600">Name</th>
                        <th className="border border-slate-600">Attendance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subject?.studentsEnrolled?.map((item, index) => (
                        <tr key={index} className={`text-base h-6 ${
                            index % 2 === 0
                                ? "bg-gray-800 text-gray-300" // Custom colors for even rows
                                : "bg-gray-600 text-gray-200" // Custom colors for odd rows
                        }`}>
                            <td className="border border-slate-600 text-center p-4">{index + 1}</td>
                            <td className="border border-slate-600 text-center p-4">{item}</td>
                            <td className="border border-slate-600 text-center p-4">{user[item] && user[item][0]?.name || item}</td>
                            <td className="border border-slate-600 text-center p-4">{classes?.attendees?.includes(item) ? "Present" : "Absent"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </ScreenComponent>

    );
}

