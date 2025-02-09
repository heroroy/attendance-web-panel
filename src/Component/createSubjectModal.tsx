import {TextInput} from "./textInput.tsx";
import {FormEvent, useState} from "react";
import {DropDown} from "./DropDown.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {subjectAddThunk} from "../redux/subjectSlice.ts";
import Section from "../Model/Section.ts";
import Subject from "../Model/Subject.ts";
import Department, {getDepartmentLabel} from "../Model/Department.ts";
import {v4 as uuidv4} from 'uuid';
import readCsv from "../Util/CsvReader.ts";

export interface inputModal {
    name: string,
    students: string[]
    sec: string,
    department: string,
    paper_code : string,
    sem : string
}

type OnDismissProps = {
    onDismiss: () => void
}

export function CreateSubjectModal({onDismiss}: OnDismissProps) {

    const [input, setInput] = useState<inputModal>({
        name: "",
        students: [],
        sec: "",
        department: "",
        paper_code : "",
        sem : ""
    })
    const profile = useAppSelector(state => state.auth.profile)

    const dept: string[] = Object.values(Department)
        .map((dept: Department) => getDepartmentLabel(dept))
    const sect: string[] = Object.values(Section)

    const handleFileUpload = (file: File) => {
        if (file.type !== "text/csv") {
            alert("File must be Csv")
            return
        }

        readCsv(file)
            .then(rolls => rolls.map(roll => roll.toLowerCase().replace("/", "")))
            .then(rolls => {
                setInput((prevState) => ({
                    ...prevState, students: rolls
                }))
            })
            .catch(e => alert(e.message))
    }

    const dispatch = useAppDispatch()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        try {

            if (!input.name || input.students.length === 0 || !input.sec || !input.department || !input.paper_code || !input.sem) {
                alert("All fields are required");
                return
            }
            console.log("Studente", input.students)

            dispatch(subjectAddThunk({
                creatorName: profile?.name,
                department: input.department,
                section: input.sec,
                studentsEnrolled: input.students,
                title: input.name,
                paper_code : input.paper_code,
                semester : input.sem,
                // id : input.name + "-" + input.department + "-" + input.sec,
                id: uuidv4(),
                createdBy: profile?.email?.split('@')[0],
                created: new Date().getTime()
            } as Subject))

            onDismiss()

        } catch (error) {
            alert(error)
        }
    }


    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center "
             aria-labelledby="modal-title"
             role="dialog"
             aria-modal="true">

            {/*backdrop*/}
            <div className="fixed inset-0 bg-black transition-opacity opacity-40" onClick={onDismiss} aria-hidden="true"></div>

            <div className="relative transform overflow-hidden rounded-lg bg-base-100 text-left transition-all lg:w-auto sm:my-8">
                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                    <div className="sm:flex sm:items-start ">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex gap-7">
                            <div>
                                <h3 className=" text-2xl font-semibold" id="modal-title">Create Subject</h3>
                                <form id="addEditButton" onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">

                                    <TextInput
                                        name="name"
                                        type="text"
                                        id="name"
                                        value={input.name}
                                        placeholder="Name"
                                        onChange={(e) => {
                                            setInput({
                                                ...input,
                                                name: e.target.value
                                            })
                                        }}
                                        className={`block w-full bg-base-100 rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:text-neutral-600 sm:text-lg/6 `}
                                        required={true}
                                    />

                                    <TextInput
                                        name="section"
                                        type="text"
                                        id="section"
                                        value={input.sec}
                                        placeholder="Section"
                                        onChange={(e) => {
                                            setInput({
                                                ...input,
                                                sec: e.target.value
                                            })
                                        }}
                                        className={`block w-full bg-base-100 rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:text-neutral-600 sm:text-lg/6 `}
                                        required={true}
                                    />


                                    <DropDown input={input} setInput={setInput} title="Semester" items={sect}/>
                                    <DropDown input={input} setInput={setInput} title="Department" items={dept}/>

                                    <TextInput
                                        name="paper_code"
                                        type="text"
                                        id="paper_code"
                                        value={input.paper_code}
                                        placeholder="Paper Code"
                                        onChange={(e) => {
                                            setInput({
                                                ...input,
                                                paper_code: e.target.value
                                            })
                                        }}
                                        className={`block w-full bg-base-100 rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:text-neutral-600 sm:text-lg/6 `}
                                        required={true}
                                    />
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer hover:bg-blue-800 bg-blue-700">
                                            <div className="flex flex-col items-center justify-center p-2">
                                                <svg
                                                    className="w-8 h-8 mb-0.5 text-white"
                                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round"
                                                          stroke-linejoin="round" stroke-width="2"
                                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="text-sm text-white">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop</p>
                                                <p className="text-xs text-white">CSV file
                                                    Only</p>
                                            </div>

                                            <TextInput
                                                name="file"
                                                type="file"
                                                id="dropzone-file"
                                                onChange={(e) => {
                                                    if (e.target.files) handleFileUpload(e.target?.files[0]);
                                                }}
                                                className="hidden"
                                                accept="text/csv"
                                                required={true}
                                            />

                                        </label>
                                    </div>

                                </form>
                            </div>
                            <div className="overflow-y-auto">
                                <h5 className="mb-3">Students</h5>
                                <div className="overflow-y-auto h-96 scroll-smooth">
                                    <table className="table-zebra border-collapse border border-slate-500 w-80 h-56 scroll-auto">
                                        <thead>
                                        <tr>
                                            <th className="border border-slate-600">Sl No.</th>
                                            <th className="border border-slate-600">Roll No.</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {input.students.map((item, index) => (
                                            <tr>
                                                <td className="border border-slate-600 text-center">{index + 1}</td>
                                                <td className="border border-slate-600 text-center">{item}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" form="addEditButton" className="inline-flex w-full justify-center bg-green-600 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Save
                    </button>
                    <button onClick={onDismiss} type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel
                    </button>
                </div>
            </div>
        </div>

    );
}


