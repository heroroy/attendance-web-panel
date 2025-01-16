import {TextInput} from "./textInput.tsx";
import {FormEvent  , useEffect  , useState} from "react";
import {DropDown} from "./DropDown.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {subjectAddThunk} from "../redux/subjectSlice.ts";
import Section from "../Model/Section.ts";
import Subject from "../Model/Subject.ts";
import Department, {getDepartmentLabel} from "../Model/Department.ts";
import { v4 as uuidv4 } from 'uuid';

export interface inputModal {
    name: string,
    file : FileList | null | Blob,
    sec : string ,
    department : string
}

type OnDismissProps = {
    onDismiss : () => void
}

export function CreateSubjectModal({ onDismiss } : OnDismissProps) {

    const [input , setInput] = useState<inputModal> ( {
        name : "",
        file : null,
        sec : "",
        department : ""
    } )
    const profile = useAppSelector(state => state.auth.profile)
    const [ roll, setRoll] = useState<string[]>([])

    const dept : string[] = Object.values(Department)
        .map((dept : Department) => getDepartmentLabel(dept))
    const sect : string[] = Object.values(Section)

    const fileReader = new FileReader()
    const csvFileToArray = (text : any) => {
        // console.log(text)
        const csvHeader = text.toString().slice(0, text.indexOf("\n")).split(",")
        const csvRows = text.toString().slice(text.indexOf("\n") + 1).split("\n")
        const columns : { [key: string]: any[] } = {}
        // console.log(csvHeader)
        csvHeader.map((header: string  )=>(
            columns[header] = []
        ))
        csvRows.map((i : string )=>{
            const values = i.split(",")
            csvHeader.map((header : string , index : number )=>{
                columns[header]?.push(values[index]?.trim().toLowerCase() || "")
            })
        })

        Object.entries(columns).map(entry => {
            let key = entry[0];
            let value = entry[1];
            if(key==="Roll") setRoll(value)

        });
    }
    const handleFileUpload=(file : any)=>{
        if(file.type !== "text/csv"){
            alert("File must be Csv")
            return
        }

        setInput((prevState)=>({
            ...prevState,
            file : file
        }))
    }

    useEffect ( () => {
        if(input.file){
            fileReader.onload = (event) => {
                const text = event.target?.result
                csvFileToArray(text)
            }

            fileReader.readAsText(input.file as Blob)
        }
    } , [input.file] );

    const dispatch = useAppDispatch()

    function handleSubmit(e : FormEvent) {
        e.preventDefault ()
        try {

            if(!input.name || !input.file || !input.sec || !input.department){
                alert("All fields are required");
                return
            }
            // console.log(input.file)
            setInput ((prevState)=>( { ...prevState , name : input.name, file : input.file, sec : input.sec, department : input.department }) )

            dispatch(subjectAddThunk({
                    creatorName : profile?.name,
                    department : input.department,
                    section : input.sec,
                    studentsEnrolled : roll.slice(0,roll.length-1),
                    title : input.name,
                    // id : input.name + "-" + input.department + "-" + input.sec,
                    id : uuidv4(),
                    createdBy : profile?.email?.split('@')[0],
                    created: new Date().getTime()
                } as Subject ))

            onDismiss()

        }catch (error){
            alert(error)
        }
    }


    return (
        <div  className="fixed inset-0 z-10 flex items-center justify-center "
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true">

            {/*backdrop*/}
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity opacity-5" onClick={onDismiss} aria-hidden="true"></div>

                        <div
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all lg:w-auto sm:my-8 ">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                                <div className="sm:flex sm:items-start ">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex gap-7">
                                        <div>
                                            <h3 className=" text-2xl font-semibold text-gray-900"
                                                id="modal-title">Create Subject</h3>
                                            <form id="addEditButton" onSubmit={ handleSubmit }
                                                  className="mt-2 flex flex-col gap-3" data-theme="light">

                                                <TextInput
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    value={ input.name }
                                                    placeholder="Name"
                                                    onChange={ (e) => {
                                                        setInput({
                                                            ...input ,
                                                            name : e.target.value
                                                        } )
                                                         }}
                                                    className={ `block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:text-neutral-600 sm:text-lg/6 ` }
                                                    required={true}
                                                />
                                                <DropDown input={input} setInput={setInput} title="Department" items={dept} />
                                                <DropDown input={input} setInput={setInput} title="Section" items={sect} />
                                                <div className="flex items-center justify-center w-full" data-theme="light">
                                                    <label htmlFor="dropzone-file"
                                                           className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-blue-800 dark:bg-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                        <div
                                                            className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg
                                                                className="w-8 h-8 mb-0.5 text-gray-500 dark:text-gray-400"
                                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" stroke-linecap="round"
                                                                      stroke-linejoin="round" stroke-width="2"
                                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                            </svg>
                                                            <p className=" text-sm text-gray-500 dark:text-gray-400">
                                                                <span
                                                                    className="font-semibold">Click to upload</span> or
                                                                drag and drop</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">CSV file Only</p>
                                                        </div>

                                                        <TextInput
                                                            name="file"
                                                            type="file"
                                                            id="dropzone-file"
                                                            onChange={(e) => {
                                                                if (e.target.files) handleFileUpload(e.target?.files[0]);
                                                            }}
                                                            className="hidden"
                                                            required={true}
                                                        />

                                                    </label>
                                                </div>

                                            </form>
                                        </div>
                                        <div className="overflow-y-auto">
                                            <h5 className="text-neutral-600 mb-3">Students</h5>
                                            <div className="overflow-y-auto h-80 scroll-smooth">
                                                 <table
                                                    className="table-zebra border-collapse border border-slate-500 w-80 h-56 scroll-auto" data-theme="light">
                                                <thead>
                                                <tr>
                                                    <th className="border border-slate-600">Sl No.</th>
                                                    <th className="border border-slate-600">Roll No.</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                { roll?.slice(0,roll?.length-1).map ( (item , index) => (
                                                    <tr >
                                                        <td className="border border-slate-600">{ index + 1 }</td>
                                                        <td className="border border-slate-600">{ item }</td>
                                                    </tr>
                                                ) ) }
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="submit" form="addEditButton"
                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Save
                                </button>
                                <button onClick={ onDismiss } type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel
                                </button>
                            </div>
                        </div>
        </div>

    );
}


