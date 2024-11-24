import {TextInput} from "./textInput.tsx";
import {useEffect, useState} from "react";
import {DropDown} from "./DropDown.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {subjectAddThunk} from "../redux/subjectSlice.ts";
import Section from "../Model/Section.ts";
import Subject from "../Model/Subject.ts";
import Department, {getDepartmentLabel} from "../Model/Department.ts";

interface inputModal {
    name: string,
    file : FileList | null,
    sec : string ,
    department : string
}
// export interface cardProps {
//     dept_name : "",
//     card : inputModal
// }

export function CreateSubjectModal({ onDismiss }) {

    const [input , setInput] = useState<inputModal> ( {
        name : "",
        file : null,
        sec : "",
        department : ""
    } )
    const profile = useAppSelector(state => state.auth.profile)
    const [ roll, setRoll] = useState([])

    const dept = Object.values(Department)
        .map(dept => getDepartmentLabel(dept))
    const sect = Object.values(Section)

    const fileReader = new FileReader()
    const csvFileToArray = (text : any) => {
        // console.log(text)
        const csvHeader = text.toString().slice(0, text.indexOf("\n")).split(",")
        const csvRows = text.toString().slice(text.indexOf("\n") + 1).split("\n")
        const columns = []
        // console.log(csvHeader)
        csvHeader.map(header=>(
            columns[header] = []
        ))
        csvRows.map((i)=>{
            const values = i.split(",")
            csvHeader.map((header, index)=>{
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
        setInput((prevState)=>({
            ...prevState,
            file : file
        }))
    }

    useEffect ( () => {
        if(input.file){
            fileReader.onload = (event) => {
                const text = event.target.result
                csvFileToArray(text)
            }

            fileReader.readAsText(input.file as Blob)
        }
    } , [input.file] );

    const dispatch = useAppDispatch()

    function handleSubmit(e) {
        e.preventDefault ()
        try {

            if(!input.name || !input.file || !input.sec || !input.department){
                alert("All fields are required");
                return
            }
            // console.log(input.file)
            setInput ((prevState)=>( { ...prevState , name : input.name, file : input.file, sec : input.sec, department : input.department }) )

            // setSubjectCard((prevState)=>[
            //     ...prevState,
            //     { dept_name : input.name , card : input }
            // ])

            dispatch(subjectAddThunk({
                creatorName : profile?.name,
                department : input.department,
                section : input.sec,
                studentsEnrolled : roll.slice(0,roll.length-1),
                title : input.name,
                id : input.name + "-" + input.department + "-" + input.sec,
                createdBy : profile?.name,
                created: new Date().getTime()
            } as Subject ))

        }catch (error){
            alert(error)
        }
    }

    // console.log(input)
    // console.log(roll)

    return (
        <div>
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                        <div
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all lg:w-auto sm:my-8 ">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex gap-7">
                                        <div>
                                            <h3 className=" text-2xl font-semibold text-gray-900"
                                                id="modal-title">Create Subject</h3>
                                            <form id="addEditButton" onSubmit={ handleSubmit }
                                                  className="mt-2 flex flex-col gap-3">

                                                <TextInput
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    value={ input.name }
                                                    placeholder="Name"
                                                    onChange={ (e) => setInput ( {
                                                        ...input ,
                                                        name : e.target.value
                                                    } ) }
                                                    className={ `block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:text-neutral-400 sm:text-sm/6 ` }
                                                    required={true}
                                                />
                                                <DropDown input={input} setInput={setInput} title="Department" items={dept} />
                                                <DropDown input={input} setInput={setInput} title="Section" items={sect} />
                                                <div className="flex items-center justify-center w-full">
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
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG,
                                                                PNG, JPG or GIF (MAX. 800x400px)</p>
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

                                                        {/*<input required={true}  id="dropzone-file" type="file" onChange={(e) => {*/}
                                                        {/*    if (e.target.files) handleFileUpload(e.target.files[0]);*/}
                                                        {/*}} className="hidden"/>*/}

                                                    </label>
                                                </div>

                                            </form>
                                        </div>
                                        <div>
                                            <h5>Students</h5>
                                             <table
                                                className="table-fixed border-collapse border border-slate-500 w-80 h-full">
                                                <thead>
                                                <tr>
                                                    <th className="border border-slate-600">Sl No.</th>
                                                    <th className="border border-slate-600">Roll No.</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                { roll.slice(0,roll.length-1).map ( (item , index) => (
                                                    <tr>
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
                </div>
            </div>
        </div>
    );
}

