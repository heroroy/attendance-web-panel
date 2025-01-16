import {getDate} from "../Util/Naming_Conv.ts";
import {useNavigate} from "react-router-dom";
import {Class} from "../Model/classes.ts";

export function ClassBlock({classInfo} : {classInfo : Class}) {

    const { date, monthShort} = getDate(classInfo.createdOn)
    const navigate = useNavigate()



    if (!classInfo.id) {
        navigate(-1)
        return
    }

    function handleClick(){
        navigate(`../class/${classInfo.id}`)
    }



    return (
        // <div   className="flex flex-col   ">
             <div onClick={handleClick} className="btn shadow-gray-700 shadow-md bg-slate-600 flex-nowrap h-20 w-20 gap-0 flex flex-col ">
                 <span className="text-2xl">{date}</span>
                 <span className="text-xs font-light">{monthShort}</span>
             </div>
        // </div>
    );
}

