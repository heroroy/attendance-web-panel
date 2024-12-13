import {useParams} from "react-router-dom";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {getClassByIdThunk } from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import User from "../Model/User.ts";
import {keys} from "lodash";
import ExcelJS from "exceljs";
import {getDate} from "../Util/Naming_Conv.ts";
import _ from "lodash"
import {ExportExcel} from "../Component/exportExcel.ts";
import {Class} from "../Model/classes.ts";

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
        subject?.studentsEnrolled?.map(students=>students as User)
    } , [subject] );

    console.log(subject?.studentsEnrolled)


    const user = _.groupBy(users,'id')

    function exportFunc(){
        ExportExcel( { studentDates : [classes] , subject : subject })
    }




    // subject?.studentsEnrolled.map(student=>(
    //     (users.id === student) && (
    //          Object.create({
    //             id : student,
    //             name : users.name
    //         })
    //     )
    // ))
    // Object.create({
    //     id : users.id
    // })

    return (
        <>
            <div className="flex  justify-between px-4 w-full mb-8">
                <div>
                    <p>{subject?.title} - { subject?.department?.split(" ").map(word=>word.charAt(0)).join("") } { subject?.section }  </p>
                    <h4>{getDate(classes?.createdOn).month}, {getDate(classes?.createdOn).date}</h4>
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
                        <td className="border border-slate-600 text-center">{ classes?.attendees?.includes(item) ? "P" : "A" }</td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </>
    );
}

