import {useAppDispatch, useAppSelector} from "../redux/store.ts";

import {loginThunk} from "../redux/profileSlice.ts"
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

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
        <div className='w-full h-full flex flex-row justify-center items-center'>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}