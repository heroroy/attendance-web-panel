import {useNavigate} from "react-router-dom";
import Subject from "../Model/Subject.ts";

interface SubjectCardProps {
    subject: Subject
}

const SubjectCard = ({subject}: SubjectCardProps) => {

    const navigate = useNavigate()

    function handleClick() {
        navigate(`../subject/${subject.id}`)
    }

    return (
        <div onClick={handleClick} className="card cursor-pointer rounded-lg bg-base-300 hover:bg-base-200 hover:ring-2 hover:shadow-md p-4 w-60 transition-all">
            <div className="card-body items-stretch flex flex-col gap-4">
                <h2 className="card-title">{subject.title}</h2>
                <p className="text-base">Sem {subject.semester} - {subject.section}</p>
            </div>
        </div>
    );
}

export default SubjectCard

