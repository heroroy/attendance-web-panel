import {useEffect, useState} from "react";
import {CreateSubjectModal} from "../Component/createSubjectModal.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getSubjectThunk} from "../redux/subjectSlice.ts";
import _ from 'lodash'
import SubjectCard from "../Component/SubjectCard.tsx";
import Department, {getDepartmentLabel} from "../Model/Department.ts";
import {ProfileName} from "../Util/Naming_Conv.ts";

export function HomePage() {
    const [open, setOpen] = useState<boolean>(false)
    // const [subjectCard , setSubjectCard] = useState<cardProps[]>([])

    const dispatch = useAppDispatch()

    const {profile} = useAppSelector(state => state.auth)
    const {subjects} = useAppSelector(state => state.subject)
    console.log(subjects)
    const groupedSubjects = _.groupBy(subjects, 'department')

    useEffect(() => {
        if (profile?.id == null) return
        dispatch(getSubjectThunk({userId: profile.id}))
    }, [profile])


    console.log(JSON.stringify(groupedSubjects))

    return (
        <div  className="w-full h-full flex flex-col gap-32 relative">
            <div className='flex flex-row justify-between items-center'>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-2xl">Welcome Back</span>
                    <span className="text-5xl font-bold">{ProfileName(profile?.name)}</span>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="px-8 py-4 z-10 rounded-full text-lg text-white bg-blue-600"
                >
                    + Subject
                </button>
            </div>

            <div className="">
                {Object.keys(groupedSubjects).map(dept => (
                    <div className="flex flex-col gap-8">
                        <span className='text-xl font-medium'>{getDepartmentLabel(Department[dept]) || dept}</span>
                        <div className="flex flex-row flex-wrap gap-4">
                            {groupedSubjects[dept].map(subject => <SubjectCard subject={subject}/>)}
                            {/*{groupedSubjects[dept].map(subject => <SubjectCard subject={subject}/>)}*/}
                            {/*{groupedSubjects[dept].map(subject => <SubjectCard subject={subject}/>)}*/}
                        </div>
                    </div>
                ))}
            </div>

            {open && <CreateSubjectModal onDismiss={() => setOpen(false)}/>}
        </div>
    );
}

