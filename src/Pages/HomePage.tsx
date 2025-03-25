import {useEffect, useState} from "react";
import {CreateSubjectModal} from "../Component/createSubjectModal.tsx";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getSubjectThunk} from "../redux/subjectSlice.ts";
import _ from 'lodash'
import SubjectCard from "../Component/SubjectCard.tsx";
import Department from "../Model/Department.ts";
import {capitalizeWords} from "../Util/Naming_Conv.ts";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";

export function HomePage() {
    const [open, setOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const {profile, loading, error: profileError} = useAppSelector(state => state.auth)
    const {subjects, getSubError: subjectError, getSubLoading: subjectsLoading} = useAppSelector(state => state.subject)

    const groupedSubjects = _.groupBy(subjects, 'department')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
        const profileId = profile?.id
        if (!profileId) return

        dispatch(getSubjectThunk({userId: profileId})).catch()

    }, [profile, dispatch])

    let errorstate: string | null | undefined
    let screenState: ScreenState

    if (profileError || subjectError) {
        screenState = ScreenState.ERROR
        errorstate = profileError || subjectError
    } else if (loading || subjectsLoading) screenState = ScreenState.LOADING
    else screenState = ScreenState.SUCCESS


    return (

        <ScreenComponent error={errorstate} state={screenState}>
            <div className="w-full h-full items-stretch flex flex-col gap-32 relative ">
                <div className='flex w-full flex-row justify-between items-center'>
                    <div className="flex flex-col gap-4">
                        <span className="text-gray-500 text-2xl font-semibold">Welcome Back</span>
                        {profile && <span className="text-5xl font-bold">{capitalizeWords(profile.name)}</span>}
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        className="px-8 py-2  rounded-full text-lg btn btn-primary"
                    >
                        + Subject
                    </button>

                </div>

                <div className="">
                    {Object.keys(groupedSubjects).map((dept) => (
                        <div className="flex flex-col gap-8 mb-16">
                            <span
                                className='text-2xl font-medium'>{Department[dept as keyof typeof Department] || dept}</span>
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

