import {ReactNode, useEffect} from "react";
import {MdError} from "react-icons/md";
import {useAppSelector} from "../redux/hooks.ts";
import {useNavigate} from "react-router-dom";

export enum ScreenState {
    ERROR = "ERROR", SUCCESS = "SUCCESS", LOADING = "LOADING"
}

interface ScreenComponentProps {
    state?: ScreenState,
    children?: ReactNode,
    error?: string | null | undefined,
    authRequired?: boolean
}

export function ScreenComponent({state, children, error, authRequired = true}: ScreenComponentProps) {

    const navigate = useNavigate()
    const {profile} = useAppSelector(state => state.auth)

    useEffect(() => {
        if (!authRequired || profile) return
        navigate('/', {replace: true})
    }, [navigate, profile, authRequired]);

    switch (state) {
        case ScreenState.LOADING:
            return <span className="h-screen flex items-center justify-center loading loading-spinner loading-lg"/>
        case ScreenState.SUCCESS:
            return <div className='w-full h-full'>{children}</div>
        case ScreenState.ERROR:
            return <div className='h-screen flex flex-col items-center justify-center gap-8 text-error'>
                <MdError size='6rem'/>
                <p className="text-2xl">{error}</p>
            </div>
    }
}

