import {useParams} from "react-router-dom";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {getClassByIdThunk } from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import User from "../Model/User.ts";
import {keys} from "lodash";

export function ClassPage() {

    const [userDetail, setUserDetail] = useState<User[]>([])

    const params = useParams()

    const dispatch = useAppDispatch()

    const { classes } = useAppSelector(state => state.class)
    const { subject } = useAppSelector(state => state.subjectById)
    const { users } = useAppSelector(state => state.userById)
    let userD = []


    useEffect ( () => {
        dispatch(getClassByIdThunk({id : params.id}))
    } , [dispatch] );

    useEffect ( () => {
        dispatch(getSubjectByIdThunk({id : classes.subjectId}))
    } , [classes] );


    useEffect ( () => {
        dispatch(getUsersByIdsThunk({id : subject?.studentsEnrolled}))
    } , [subject] );

    console.log(classes)


    return (
        <>
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
                        <td className="border border-slate-600 text-center">{ users[index]?.id === item ? users[index]?.name : item }</td>
                        <td className="border border-slate-600 text-center">{ classes?.attendees?.includes(item) ? "P" : "A" }</td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </>
    );
}

