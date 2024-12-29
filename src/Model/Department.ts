enum Department {
    IT = "IT",
    CSE = "CSE",
    ECE = "ECE",
    EE = "EE",
}

export const getDepartmentLabel = (department: Department ) => {
    switch (department) {
        case Department.IT:
            return "Information Technology"
        case Department.CSE:
            return "Computer Science"
        case Department.ECE:
            return "Electronics and Communication"
        case Department.EE:
            return "Electrical Engineering"
    }
}

export const getDepartmentFromLabel = (label: string) => {
    switch (label) {
        case "Information Technology":
            return Department.IT
        case "Computer Science":
            return Department.CSE
        case "Electronics and Communication":
            return Department.ECE
        case "Electrical Engineering":
            return Department.EE
    }
}

export default Department