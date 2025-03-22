import {ReactNode , useEffect} from "react";
import {toast , ToastContainer} from "react-toastify";

export enum ScreenState {
    ERROR = "ERROR", SUCCESS = "SUCCESS", LOADING = "LOADING"
}

interface ScreenComponentProps {
    state?: ScreenState,
    children?: ReactNode,
    error? : string | null | undefined
}

export function ScreenComponent({state, children, error}: ScreenComponentProps) {

    useEffect(()=>{
        setTimeout(()=>{
            toast(error,{
                type : "error",
                theme : "colored",
                position : "top-center",
                draggable: true,

            })
        },300)

    },[error])



    switch (state) {
        case ScreenState.LOADING:
            return <p className="h-screen">Loading...</p>
        case ScreenState.SUCCESS:
            return <div className='w-full h-full'>{children}</div>
        case ScreenState.ERROR:
            return(
                <div>
                    <p className="h-screen">
                        Error State
                    </p>
                    <ToastContainer position="top-center" />
                </div>

            )
    }


}

