import {useParams} from "react-router-dom";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {getClassByIdThunk } from "../redux/classesSlice.ts";
import {getSubjectByIdThunk} from "../redux/getSubjectById.ts";
import {getUsersByIdsThunk} from "../redux/userSlice.ts";
import User from "../Model/User.ts";
import {keys} from "lodash";
import ExcelJS from "exceljs";

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

    const exportFile = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("my sheet")
        sheet.properties.defaultRowHeight = 50


        sheet.columns = [
            {
                header : "sl No.",
                key : 'index',
                width : 10
            },
            {
                header : "Roll No.",
                key : 'roll',
                width : 15
            },
            {
                header : "Name",
                key : 'name',
                width : 15
            },
            {
                header : "Present",
                key : 'present',
                width : 15
            },
        ]

        subject?.studentsEnrolled?.map((student, index)=> {

            let rowData = {
                index : index+1,
                roll : student,
                name : users[index]?.id === student ? users[index]?.name : student,
                present : classes?.attendees?.includes(student) ? "P" : "A"
            }

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
            writeFile("day_to_day_attendance_sheet",data)
        })
            .catch((error) => {
                console.error("Error generating CSV:", error);
            });


    }


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

