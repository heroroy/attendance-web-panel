import {MdArrowDropDown} from "react-icons/md";
import {useRef , useState} from "react";

type DropDownProps = {
    items : String[],
    title : string,
    // handleClick : (data : string) => void
    setInput,
    input
}

export function DropDown({ items , title, setInput, input} : DropDownProps) {
    function handleClick(e){
        e.preventDefault()
        // console.log(e.target.textContent)
        if(title === "Section"){
            setInput ( {
                ...input ,
                sec : e.target.textContent
            } )
        }
        if(title === "Department"){
            setInput ( {
                ...input ,
                department : e.target.textContent
            } )
        }
    }

    return (
        <>
            <details className="dropdown">
                <summary className="btn m-1 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-5 cursor-pointer">
                    { title }
                    <MdArrowDropDown size={22}/>
                </summary>
                <ul onClick={handleClick} className="menu dropdown-content bg-base-100 cursor-pointer rounded-box z-[1] w-52 p-2 shadow">
                    {items.map(data=>(
                        <li><a>{data}</a></li>
                    ))}
                </ul>
            </details>
        </>
    );
}


