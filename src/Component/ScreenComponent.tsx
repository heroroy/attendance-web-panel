import {ReactNode} from "react";

export enum ScreenState {
    ERROR = "ERROR", SUCCESS = "SUCCESS", LOADING = "LOADING"
}

interface ScreenComponentProps {
    state?: ScreenState,
    children?: ReactNode
}

export function ScreenComponent({state, children}: ScreenComponentProps) {

    switch (state) {
        case ScreenState.LOADING:
            return <p className="h-screen">Loading...</p>
        case ScreenState.SUCCESS:
            return <>{children}</>
        case ScreenState.ERROR:
            return <p className="h-screen">Error State</p>
    }
}

