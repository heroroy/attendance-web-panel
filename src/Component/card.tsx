import {useEffect , useState} from "react";
import {useNavigate} from "react-router-dom";

interface subProps {
    dept : string,
    sec: string
}
export function Card({subjectCard}) {

    console.log(subjectCard[0][`department`])

    const [sub, setSub] = useState<subProps>({
        dept : "",
        sec : ""
    })

    const navigate = useNavigate()

    useEffect ( () => {
        // Object.entries(subjectCard.subject).map((item : [string,string])=>{
        //     let key = item[0]
        //     let value = item[1]
        //     if(key==="department") setSub((prevState)=>({...prevState,dept : value}))
        //     if(key==="section") setSub((prevState)=>({...prevState,sec : value}))
        // })

    } , [] );

    function handdleClick(id){
        navigate(`../subject/${id}`)
    }

    return (
        <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                {subjectCard.map(item=>(
                    <div onClick={()=>handdleClick(item.title)} className="card border-2 rounded-lg shadow-xl bg-gray-200 p-5 text-neutral-content w-96">
                        <div className="card-body flex flex-col gap-2">
                            <h2 className="card-title">{item.title}</h2>
                            <p>{item.department}-{item.section}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


