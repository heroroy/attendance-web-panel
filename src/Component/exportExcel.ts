import ExcelJS from "exceljs";
import {Class} from "../Model/classes.ts";
import Subject from "../Model/Subject.ts";

type ExportExcelProps = {
    studentDates : Class[] ,
    subject : Subject
}

export function ExportExcel({ studentDates , subject } : ExportExcelProps) {

        console.log(studentDates)
        console.log(subject)

        const workbook = new ExcelJS.Workbook ();
        const sheet = workbook.addWorksheet ( "my sheet" )
        sheet.properties.defaultRowHeight = 50

        Object.keys(studentDates).map(date=>date as Class[])


        sheet.columns = [
            {
                header : "Sl No." ,
                key : 'index' ,
                width : 10
            } ,
            {
                header : "Roll Number" ,
                key : 'roll' ,
                width : 10
            } ,
            ...studentDates.map((date)=>(
                {
                    header : new Intl.DateTimeFormat('en-US').format(date.createdOn)  ,
                    key : date.id ,
                    width : 10
                }
            ))
        ]

        subject?.studentsEnrolled?.map ( (student , index ) => {

            const rowData = {
                index : index+1,
                roll : student
            }

            studentDates?.map ( (date) => {
                const isPresent = date.attendees?.includes ( student )
                rowData[date.id] = isPresent ? "Present" : "Absent"
                console.log ( student , rowData[date.id] )
            } )

            console.log ( rowData )

            sheet.addRow ( rowData );

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
        } )

        const writeFile = (fileName , content) => {
            const link = document.createElement ( "a" );
            const blob = new Blob ( [content] , {
                type : "application/vnd.ms-excel;charset=utf-8;"
            } );
            link.download = fileName;
            link.href = URL.createObjectURL ( blob );
            link.click ();
        };

        workbook.xlsx.writeBuffer ().then ( data => {
            writeFile ( "attendance_sheet" , data )
        } )
            .catch ( (error) => {
                console.error ( "Error generating CSV:" , error );
            } );




}

