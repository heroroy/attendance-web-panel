import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {getClassByIdThunk } from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import User from "../Model/User.ts";
import {isArray, keys} from "lodash";
import ExcelJS from "exceljs";
import {capitalizeWords, formatDate, getDate} from "../Util/Naming_Conv.ts";
import _ from "lodash"
import {exportAttendance} from "../Component/exportAttendance.ts";
import {Class} from "../Model/classes.ts";

export function ClassPage() {

    const [userDetail, setUserDetail] = useState<User[]>([])

    const params = useParams()

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { classes } = useAppSelector(state => state.class)
    const { subject } = useAppSelector(state => state.subjectById)
    const { users } = useAppSelector(state => state.userById)
    let userD = []


    useEffect ( () => {
        if(!params.id) {
            navigate(-1)
            return
        }
        dispatch(getClassByIdThunk({id : params.id}))
    } , [navigate, params.id, dispatch] );

    useEffect ( () => {
        if(!classes || isArray(classes)) return

        dispatch(getSubjectByIdThunk({id : classes.subjectId}))
    } , [dispatch, classes] );


    useEffect (() => {
        if(!subject) return

        dispatch(getUsersByIdsThunk({id : subject.studentsEnrolled}))
    } , [dispatch, subject]);

    const user = _.groupBy(users,'id')

    function exportFunc(){
        if(isArray(classes) || !subject) return

        exportAttendance({ classes : [classes] , subject : subject })
            .then(() => alert("Attendance Exported"))
            .catch(() => alert("Error Exporting Attendance"))
    }
    if(!classes || isArray(classes))
        return <h1>Loading...</h1>
    return (
        <>
            <div className="flex  justify-between px-4 w-full mb-8">
                <div>
                    <p>{subject?.title} - {capitalizeWords(subject?.department ?? "")} {subject?.section}</p>
                    <h4>{formatDate(new Date(classes?.createdOn))}</h4>
                </div>
                <div>
                    <button className="btn btn-secondary" onClick={exportFunc}>Export</button>
                </div>
            </div>
            <table
                className="table-fixed border-collapse border border-slate-500 w-full h-full" data-theme="light">
                <thead>
                <tr>
                    <th className="border border-slate-600">Sl No.</th>
                    <th className="border border-slate-600">Roll No.</th>
                    <th className="border border-slate-600">Name</th>
                    <th className="border border-slate-600">Present</th>
                </tr>
                </thead>
                <tbody>
                { subject?.studentsEnrolled?.map ( (item , index) => (
                    <tr >
                        <td className="border border-slate-600 text-center">{ index + 1 }</td>
                        <td className="border border-slate-600 text-center">{ item }</td>
                        <td className="border border-slate-600 text-center">{ user[item] && user[item][0]?.name || item }</td>
                        <td className="border border-slate-600 text-center">{ classes?.attendees?.includes(item) ? "Present" : "Absent" }</td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </>
    );
}

