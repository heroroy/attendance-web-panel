import {groupBy} from "lodash";
import {getDate} from "../Util/Naming_Conv.ts";
import {getMonths} from "../Model/Months.ts";
import {useNavigate} from "react-router-dom";

export function ClassBlock({classInfo}) {

    const {month , date} = getDate(classInfo.createdOn)
    const navigate = useNavigate()

    function handleClick(){
        navigate(`../class/${classInfo.id}`)
    }



    return (
        <>
            <div onClick={handleClick} className="flex flex-col   ">
                 <div className="btn btn-secondary w-fit flex mt-5 flex-col ">
                     <span>{date}</span>
                     <span>{getMonths(month)}</span>
                 </div>
            </div>
        </>
    );
}

