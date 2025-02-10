enum Department {
    IT = "Information Technology",
    CSE = "Computer Science",
    ECE = "Electronics and Communications",
    EE = "Electrical",
}

export const getDepartmentFromLabel = (label: string) => {
    switch (label) {
        case Department.IT:
            return Department.IT
        case Department.CSE:
            return Department.CSE
        case Department.ECE:
            return Department.ECE
        case Department.EE:
            return Department.EE
    }
}

export const getDepartmentShort = (dept: Department) => {
    switch (dept) {
        case Department.IT:
            return "IT"
        case Department.CSE:
            return "CSE"
        case Department.ECE:
            return "ECE"
        case Department.EE:
            return "EE"
    }
}

export default Department