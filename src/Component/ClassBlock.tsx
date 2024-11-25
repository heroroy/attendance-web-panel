import {groupBy} from "lodash";
import {getDate} from "../Util/Naming_Conv.ts";
import {getMonths} from "../Model/Months.ts";

export function ClassBlock({classDate}) {

    const {month , date} = getDate(classDate)



    return (
        <>
            <div className="flex flex-col mt-10  ">
                { getMonths(month) }
                 <div className="btn btn-secondary w-fit flex mt-5 flex-col ">
                     <span>{date}</span>
                     <span>{getMonths(month)}</span>
                 </div>
            </div>
        </>
    );
}

