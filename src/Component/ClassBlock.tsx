import {getDate} from "../Util/Naming_Conv.ts";
import {useNavigate} from "react-router-dom";
import {Class} from "../Model/Class.ts";

export function ClassBlock({classInfo}: { classInfo: Class }) {

    const {date, monthShort} = getDate(classInfo.createdOn)
    const navigate = useNavigate()


    if (!classInfo.id) {
        navigate(-1)
        return
    }

    function handleClick() {
        navigate(`../class/${classInfo.id}`)
    }


    return (
        <div onClick={handleClick} className="btn bg-base-300 hover:bg-base-200 flex-nowrap h-32 w-32 gap-2 flex flex-col">
            <span className="text-3xl">{date}</span>
            <span className="text-xl font-light">{monthShort}</span>
        </div>
    );
}

