import {ReactNode} from "react";
import {MdError} from "react-icons/md";

export enum ScreenState {
    ERROR = "ERROR", SUCCESS = "SUCCESS", LOADING = "LOADING"
}

interface ScreenComponentProps {
    state?: ScreenState,
    children?: ReactNode,
    error?: string | null | undefined
}

export function ScreenComponent({state, children, error}: ScreenComponentProps) {
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

