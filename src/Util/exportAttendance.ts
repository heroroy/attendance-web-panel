import ExcelJS from "exceljs";
import {Class} from "../Model/Class.ts";
import Subject from "../Model/Subject.ts";

type ExportExcelProps = {
    classes: Class[],
    subject: Subject
}

export function exportAttendance({classes, subject}: ExportExcelProps): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Attendance')
            sheet.properties.defaultRowHeight = 50
            sheet.columns = getColumns({classes})

            getAttendanceRows({classes, subject})
                .forEach(row => sheet.addRow(row))
            resolve(workbook)
        } catch (e) {
            reject(e)
        }
    })
        .then((workbook : any ) => workbook.xlsx.writeBuffer())
        .then((data : ArrayBuffer) => downloadFile(`${subject.title} - ${subject.section}`, data))
}

function downloadFile(fileName: string, data: ArrayBuffer) {
    const link = document.createElement("a");
    const blob = new Blob([data], {
        type: "application/vnd.ms-excel;charset=utf-8;"
    });
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
}

function getColumns({classes}: { classes: Class[] }) {
    return [
        {header: "Sl No.", key: 'index', width: 5},
        {header: "Roll Number", key: 'roll', width: 20},
        ...classes.map((classData) => (
            {
                header: new Date(classData.createdOn).toLocaleDateString('en-GB'),
                key: classData.id,
                width: 5,
            }
        )),
        {header: "Attendance", key: 'attendance', width: 5},
        {header: "Attendance %", key: 'attendancePercentage', width: 5}
    ]
}

function getAttendanceRows({classes, subject}: ExportExcelProps) {
    return subject.studentsEnrolled.map((roll, index) => {
        const row : any  = {index: index + 1, roll: roll.toUpperCase()}
        let attendance = 0

        classes.forEach(classData => {
            const present = classData.attendees.includes(roll)
            row[classData.id] = present ? 'P' : 'A'
            // row[classData.id].color = present ? "green" : "red"

            if(present) attendance++

        })

        row['attendance'] = `${attendance}/${classes.length}`
        row['attendancePercentage'] = Math.round((attendance/classes.length)*100) + "%"
        return row
    })
}
