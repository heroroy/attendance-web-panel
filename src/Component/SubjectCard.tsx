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
        <div onClick={handleClick}
             className="card border-2 rounded-lg shadow-xl bg-gray-200 p-5 text-neutral-content w-96">
            <div className="card-body flex flex-col gap-2">
                <h2 className="card-title">{subject.title}</h2>
                <p>{subject.department}-{subject.section}</p>
            </div>
        </div>
    );
}

export default SubjectCard

