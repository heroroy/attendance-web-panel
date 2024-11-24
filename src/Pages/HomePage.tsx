import {useEffect, useState} from "react";
import {CreateSubjectModal} from "../Component/createSubjectModal.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getSubjectThunk} from "../redux/subjectSlice.ts";
import _ from 'lodash'
import SubjectCard from "../Component/SubjectCard.tsx";

export function HomePage() {
    const [open, setOpen] = useState<boolean>(false)
    // const [subjectCard , setSubjectCard] = useState<cardProps[]>([])

    const dispatch = useAppDispatch()

    const {profile} = useAppSelector(state => state.auth)
    const {subjects} = useAppSelector(state => state.subject)
    const groupedSubjects = _.groupBy(subjects, 'department')

    useEffect(() => {
        if(profile?.id == null) return
        dispatch(getSubjectThunk({ userId: profile.id }))
    }, [profile])


    console.log(groupedSubjects)

    return (
        <div className="border-2 ">
            <div className="border-2 p-4 flex flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto ">
                    Attend
                    <span className="text-2xl text-blue-500 font-extrabold">Ease</span>
                </h3>
                <img className="h-10 w-10 rounded-full justify-self-end mx-2" src={profile?.profilePic}/>
            </div>
            <div className=" m-7 mx-16">
                <h3 className="flex flex-col">
                    <span className="text-gray-500 text-xl">Welcome Back</span>
                    <span className="text-3xl font-bold">{profile?.name}</span>
                </h3>
            </div>

            <div className="border-2 p-16">
                {Object.keys(groupedSubjects).map(dept => (
                    <div className="flex flex-col gap-8">
                        <span>{dept}</span>
                        <div className="flex flex-row flex-wrap gap-4">
                            {groupedSubjects[dept].map(subject => <SubjectCard subject={subject}/>)}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setOpen(true)}
                className="px-7 py-3 z-10 rounded-full text-lg text-white bg-blue-600 fixed bottom-3 left-1/2"
            >
                + Subject
            </button>

            {open && <CreateSubjectModal profile={profile} onDismiss={() => setOpen(false)}/>}
        </div>
    );
}

