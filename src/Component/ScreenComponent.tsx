import {ReactNode} from "react";

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
            return <p className="h-screen">Loading...</p>
        case ScreenState.SUCCESS:
            return <div className='w-full h-full'>{children}</div>
        case ScreenState.ERROR:
            return <p className="h-screen">{error}</p>
    }
}

