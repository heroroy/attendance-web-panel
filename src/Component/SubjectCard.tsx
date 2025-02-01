import {useNavigate} from "react-router-dom";
import Subject from "../Model/Subject.ts";
import {StringFormat} from "../Util/Naming_Conv.ts";

interface SubjectCardProps {
    subject: Subject
}

const SubjectCard = ({subject}: SubjectCardProps) => {

    const navigate = useNavigate()

    function handleClick() {
        navigate(`../subject/${subject.id}`)
    }

    return (
        <div onClick={handleClick} className="card cursor-pointer rounded-lg bg-base-300 p-3 text-neutral-content w-60">
            <div className="card-body items-stretch flex flex-col gap-5">
                <h2 className="card-title">{subject.title}</h2>
                <p className="text-base">{StringFormat(subject.department)}-{subject.section}</p>
            </div>
        </div>
    );
}

export default SubjectCard

