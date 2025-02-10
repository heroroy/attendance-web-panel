import {useEffect, useState} from "react";
import {CreateSubjectModal} from "../Component/createSubjectModal.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getSubjectThunk} from "../redux/subjectSlice.ts";
import _ from 'lodash'
import SubjectCard from "../Component/SubjectCard.tsx";
import Department, {getDepartmentLabel} from "../Model/Department.ts";
import {capitalizeWords} from "../Util/Naming_Conv.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";

export function HomePage() {
    const [open, setOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const {profile, loading, error} = useAppSelector(state => state.auth)
    const {subjects} = useAppSelector(state => state.subject)
    console.log(subjects)
    const groupedSubjects = _.groupBy(subjects, 'department')

    useEffect ( () => {
        window.scrollTo(0,0)
    } , [] );

    useEffect(() => {
        (async ()=>{
            try {
                if (profile?.id == null) return
                await dispatch(getSubjectThunk({userId: profile.id}))
            }catch (error){
                console.log(error)
            }
        })()

    }, [profile, dispatch])



    return (

        <ScreenComponent state={loading ? ScreenState.LOADING : error ? ScreenState.ERROR : ScreenState.SUCCESS}>

            <div  className="w-full h-full items-stretch flex flex-col gap-32 relative ">
                <div className='flex w-full flex-row justify-between items-center'>
                    <div className="flex flex-col gap-4">
                        <span className="text-gray-500 text-2xl font-semibold">Welcome Back</span>
                        {profile && <span className="text-5xl font-bold">{ capitalizeWords(profile.name) }</span> }
                    </div>
                    <button
                        onClick={() => setOpen(!open)}
                        className="px-8 py-2 z-10 rounded-full text-lg text-white bg-blue-600 hover:bg-blue-800"
                    >
                        +  Subject
                    </button>
                </div>

                <div className="">
                    {Object.keys(groupedSubjects).map((dept) => (
                        <div className="flex flex-col gap-8 mb-16">
                            <span className='text-2xl font-medium'>{getDepartmentLabel(Department[dept as keyof typeof Department]) || dept}</span>
                            <div className="flex flex-row flex-wrap gap-10 ">
                                {groupedSubjects[dept].map(subject => <SubjectCard subject={subject}/>)}
                            </div>
                        </div>
                    ))}
                </div>

                {open && <CreateSubjectModal onDismiss={() => setOpen(false)}/>}
            </div>
        </ScreenComponent>

    );
}

