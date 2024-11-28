import {useParams} from "react-router-dom";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {getClassesByIdThunk} from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdThunk} from "../redux/userSlice.ts";
import User from "../Model/User.ts";

export function ClassPage() {

    const [userDetail, setUserDetail] = useState<User[]>([])

    const params = useParams()

    const dispatch = useAppDispatch()

    const { classArray } = useAppSelector(state => state.class)
    const { subjects } = useAppSelector(state => state.subjectById)
    const { users } = useAppSelector(state => state.userById)


    useEffect ( () => {
        dispatch(getClassesByIdThunk({id : params.id}))
    } , [dispatch] );

    useEffect ( () => {
        dispatch(getSubjectByIdThunk({id : classArray.subjectId}))
    } , [classArray] );


    useEffect ( () => {
        subjects?.studentsEnrolled?.map(item=>(
            dispatch(getUsersByIdThunk({id : item}))
        ))

    } , [subjects] );

    useEffect ( () => {

        setUserDetail((prevState)=>[...prevState,users])
    } , [users] );



    // console.log(classArray)
    // console.log(subjects)
    // console.log(users)
    console.log(userDetail)


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
                { subjects?.studentsEnrolled?.map ( (item , index) => (
                    <tr >
                        <td className="border border-slate-600 text-center">{ index + 1 }</td>
                        <td className="border border-slate-600 text-center">{ item }</td>
                        <td className="border border-slate-600 text-center">{ item }</td>
                        <td className="border border-slate-600 text-center">{ classArray.attendees.includes(item) ? "P" : "A" }</td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </>
    );
}

