import {MdArrowDropDown} from "react-icons/md";
import {Dispatch, SetStateAction, useRef, useState} from "react";
import {inputModal} from "./createSubjectModal.tsx";
import useClickOutside from "../hooks/useClickOutside.ts";


type DropDownProps = {
    items: number[] | string[],
    title: string,
    // handleClick : (data : string) => void
    setInput: Dispatch<SetStateAction<inputModal>>,
    input: inputModal,
    className?: string
}

export function DropDown({items, title, setInput, input, className = ''}: DropDownProps) {

    const [value, setValue] = useState(title)
    const detailsRef = useRef<HTMLDetailsElement | null>(null);
    useClickOutside(detailsRef, () => {
        if (detailsRef.current) {
            detailsRef.current.open = false
        }
    })

    function handleClick(data: any, e: any) {

        e.preventDefault()
        // console.log(e.target.textContent)
        if (title === "Semester") {
            setInput({
                ...input,
                // sec : e.target.textContent
                sem: data
            })
            // setValue(e.target.textContent)
            setValue(data)
        }
        if (title === "Department") {
            setInput({
                ...input,
                // department : e.target.textContent
                department: data
            })
            // setValue(e.target.textContent)
            setValue(data)
        }
        if (detailsRef.current) {
            detailsRef.current.open = false;
        }
    }

    return (
        <div className={className}>
            <details ref={detailsRef} className="w-full dropdown details-modal bg-transparent">
                <summary
                    className="btn inline-flex w-full justify-center rounded-md font-semibold ring-1 ring-inset ring-primary cursor-pointer collapse">
                    {value}
                    <MdArrowDropDown size={22}/>
                </summary>
                <ul className="menu overflow-y-auto h-48 dropdown-content bg-base-300 cursor-pointer rounded-box z-[1]  p-2 shadow-lg w-full flex flex-nowrap">
                    {items.map(data => (
                        <li onClick={(event) => handleClick(data, event)}><a style={{textDecoration: "none"}}>{data}</a>
                        </li>
                    ))}
                </ul>
            </details>
        </div>
    );
}


