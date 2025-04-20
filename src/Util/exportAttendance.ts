import ExcelJS from "exceljs";
import {Class} from "../Model/Class.ts";
import Subject from "../Model/Subject.ts";

type ExportExcelProps = {
    classes: Class[],
    subject: Subject,
    students : any
}


export type align = "fill" | "center" | "left" | "right" | "justify" | "centerContinuous" | "distributed"

const styles = {
    present: {
        font: {
            color: { argb: 'FF008000' }, // Green
            bold: true
        },
        alignment : {
            horizontal: 'center' as align
        }
    },
    absent: {
        font: {
            color: { argb: 'FFFF0000' }, // Red
            bold: true
        },
        alignment : {
            horizontal: 'center' as align
        }
    },
    textAlign : {
        alignment : {
            horizontal: 'center' as align,
        },
    }
};




export function exportAttendance({classes, subject, students}: ExportExcelProps): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Attendance')
            sheet.properties.defaultRowHeight = 50
            sheet.columns = getColumns({classes})

            getAttendanceRows({classes, subject, students})
                .forEach(row => sheet.addRow(row))

            const headerRow = sheet.getRow(1);

            headerRow.eachCell((cell)=>{
                cell.alignment = {
                    wrapText: true // This enables text wrapping at white spaces
                };
            })

            headerRow.height = 40;

            sheet.eachRow(row=>{
                row.eachCell(cell=>{
                    // cell.style = styles.textAlign
                    cell.alignment = { vertical : "middle", horizontal: 'center' }
                    if(cell.text === 'P') {
                        cell.style = styles.present
                    }
                    else if(cell.text === 'A'){
                        cell.style = styles.absent
                    }
                })
            })
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
        {header: "Sl No.", key: 'index', width: 7},
        {header: "Roll Number", key: 'roll', width: 20},
        {header: "Name", key: 'name', width: 30},
        ...classes.map((classData) => (
            {
                header: new Date(classData.createdOn).toLocaleDateString('en-GB'),
                key: classData.id,
                width: 15,
            }
        )),
        {header: `Attendance Present Count ${classes.length}`, key: 'attendance', width: 15,
            style: {  alignment: {  wrapText: true } }
              },
        {header: "Attendance %", key: 'attendancePercentage', width: 15}
    ]
}

function getAttendanceRows({classes, subject, students}: ExportExcelProps) {


    return subject.studentsEnrolled.map((roll, index) => {
        const row : any  = {index: index + 1, roll: roll.toUpperCase(), name : students[roll] && students[roll][0]?.name || "--"}
        let attendance = 0

        classes.forEach(classData => {
            const present = classData.attendees && classData.attendees.includes(roll)
            row[classData.id] = present ? 'P' : 'A'
            if(present) attendance++

        })

        row['attendance'] = `${attendance}`
        row['attendancePercentage'] = Math.round((attendance/classes.length)*100)
        return row
    })
}
