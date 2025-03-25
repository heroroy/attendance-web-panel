import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {loginThunk} from "../redux/profileSlice.ts"
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {ScreenComponent, ScreenState} from "../Component/ScreenComponent.tsx";
import logo from "../assets/rcc_logo.png"

export function Loginpage() {



    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {profile, loading, error} = useAppSelector(state => state.auth)

    const handleLogin = async () => {
        dispatch(loginThunk()).catch()
    }

    useEffect(() => {
        if (error) alert(error)
    }, [error]);

    useEffect(() => {
        if (profile == null) return
        navigate("/home", {replace: true})
    }, [navigate, profile]);

    return (

        <ScreenComponent error={error} state={loading ? ScreenState.LOADING : error ? ScreenState.ERROR : ScreenState.SUCCESS}>
            <div className="flex h-full flex-col overflow-hidden justify-center items-center gap-12">

                <div className="flex flex-col items-center gap-2">
                    <img height={130} width={130} className="mb-3" src={logo}/>
                    <h4 className="text-7xl">RCCIIT</h4>
                    <h4 className="text-7xl">Attend<span className="text-primary">Ease</span></h4>
                    <p className="text-2xl">Manage Attendance with Ease</p>
                </div>

                <button
                    className="btn btn-primary rounded-full"
                    onClick={handleLogin}
                >
                    Login with Registered Google Account
                </button>
            </div>
        </ScreenComponent>

    );
}