import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {loginThunk} from "../redux/profileSlice.ts"
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {ScreenComponent , ScreenState} from "../Component/ScreenComponent.tsx";

export function Loginpage() {

    // const [profile, setProfile] = useState({
    //     name : "",
    //     pfp : ""
    // })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {profile, loading, error} = useAppSelector(state => state.auth)

    // const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            dispatch(loginThunk())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (profile == null) return
        navigate("/home", { replace: true })
    }, [navigate, profile]);

    return (

        <ScreenComponent state={loading ? ScreenState.LOADING : error ? ScreenState.ERROR : ScreenState.SUCCESS }>
            <div className="h-screen overflow-hidden ">
                <div className="flex flex-col items-center gap-1">
                    <h4 className="text-7xl ">Attend<span className="text-blue-500">Ease</span></h4>
                    <p className="text-2xl">Manage Attendance with Ease</p>
                </div>
                <div className='w-full h-full flex flex-row justify-center items-center'>
                    <button className="btn bg-blue-700 rounded-full " onClick={handleLogin}>Login with Registered Google Account</button>
                </div>
            </div>
        </ScreenComponent>

    );
}