import {ReactNode} from "react";

export enum ScreenComponentProps  {
    error = "Error",
    success = "success",
    loading = "loading",
    empty = "empty"
}

export function ScreenComponent({  children }: {  children  : ReactNode } ) {

    return (
        <>{children}</>
    )
    // switch (state) {
    //     case ScreenComponentProps.error:
    //         return "Information Technology"
    //     case ScreenComponentProps.success:
    //         return <>{children}</>
    //     case ScreenComponentProps.loading:
    //         return "Electronics and Communication"
    //     case ScreenComponentProps.empty:
    //         return "Electrical Engineering"
    // }
}

