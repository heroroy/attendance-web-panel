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

export default Department