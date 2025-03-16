import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {useEffect , useRef , useState} from "react";
import {deleteClassThunk , getClassByIdThunk , manualAttendanceThunk} from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import _, {isArray} from "lodash";
import {formatDate} from "../Util/Naming_Conv.ts";
import {exportAttendance} from "../Util/exportAttendance.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";
import User from "../Model/User.ts";
import {getDepartmentShort} from "../Model/Department.ts";
import {MdArrowCircleLeft , MdArrowDropDown} from "react-icons/md";



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


    function deleteClass(id : string, subjectid : string){
        dispatch(deleteClassThunk( { id : id }))
        navigate(`../subject/${subjectid}`)
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
            <button onClick={()=>navigate(-1)} title="Back" className=" btn-soft btn-secondary fixed left-10 top-24"><MdArrowCircleLeft size={40}/></button>
            <div className='flex flex-col gap-16 w-full'>
                <div className='flex flex-col'>
                    <p className='text-xl lg:text-3xl text-neutral-500'>{subject?.title} - {department}</p>
                    <p className='text-xl lg:text-2xl text-neutral-400'>Sem {subject?.semester} - {subject?.section}</p>

                    <div className="flex items-center justify-between w-full mt-8">
                        <h4 className="text-3xl lg:text-5xl">{formatDate(new Date(classes?.createdOn))}</h4>
                        <div className="flex gap-4">
                            <button
                                className="btn btn-primary hover:bg-secondary px-8 btn-md"
                                onClick={exportFunc}
                            >
                                Export
                            </button>
                            <button
                                className="btn btn-error hover:bg-secondary px-8 btn-md"
                                onClick={()=>deleteClass(params.id as string, classes.subjectId)}
                            >
                                Delete
                            </button>
                        </div>
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
                        <AttendeeRow id={params.id} index={index} roll={item} user={user[item] && user[item][0]}
                                     isPresent={classes?.attendees?.includes(item)}/>
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
    isPresent: boolean,
    id? : string
}

const AttendeeRow = ({index, roll, user, isPresent, id}: AttendeeRowProps) => {
    const bgColor = index % 2 === 0 ? "bg-base-100" : "bg-base-200"

    const [dropDown, setDropDown] = useState(false)

    const dispatch = useAppDispatch()
    const dropDownRef = useRef<HTMLTableDataCellElement | null>(null)
    // useClickOutside(dropDownRef,()=>{
    //     if(dropDownRef?.current) {
    //         dropDownRef.current.open = false
    //     }
    // })
    //
    // useEffect ( () => {
    //     (()=>{
    //         console.log(dropDownRef)
    //     })()
    // } , [dropDown] );

    function changeAttendance(id : string, roll : string, field : any){
        dispatch(manualAttendanceThunk( { id : id ,attendanceField : field.innerText,roll : roll } ))
    }



    return (
        <tr  key={index} className={`text-base h-6 text-base-content ${bgColor}`}>
            <td className="border border-slate-600 text-center p-4">{index + 1}</td>
            <td className="border border-slate-600 text-center p-4">{roll}</td>
            <td className="border border-slate-600 text-center p-4">{user?.name || "--"}</td>
            <td
                className={`border border-slate-600 relative  text-center p-4 font-semibold ${isPresent ? 'text-green-600' : 'text-red-600'}`}
                ref={dropDownRef}
            >
                {isPresent ? "Present" : "Absent"}
                <button   onClick={()=>setDropDown(!dropDown)}>
                    <MdArrowDropDown size={23}/>
                </button>
                {dropDown &&
                    <button

                        onClick={(event)=>changeAttendance(id as string,roll,event.target)}
                        className="absolute bg-primary p-1 px-4 rounded-lg right-10 top-5 "
                    >
                        {isPresent ? "Absent" : "Present"}
                    </button>
                }
            </td>
        </tr>
    )
}