import {getDate} from "../Util/Naming_Conv.ts";
import {useNavigate} from "react-router-dom";

export function ClassBlock({classInfo}) {

    const {month , date} = getDate(classInfo.createdOn)
    const navigate = useNavigate()

    function handleClick(){
        navigate(`../class/${classInfo.id}`)
    }



    return (
        <div onClick={handleClick} className="flex flex-col   ">
             <div className="btn bg-slate-600 w-fit flex   flex-col ">
                 <span>{date}</span>
                 <span>{month}</span>
             </div>
        </div>
    );
}

