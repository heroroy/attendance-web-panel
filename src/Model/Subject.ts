import Department from "./Department.ts";
import Section from "./Section.ts";

export default interface Subject {
    id: string,
    created: number,
    createdBy: string,
    creatorName: string
    department: Department,
    section: Section,
    title: string
    studentsEnrolled: string[]
}