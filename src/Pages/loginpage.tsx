import {auth} from "../firebase.ts";
import {GoogleAuthProvider} from "firebase/auth"
import {useState} from "react";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";

import { loginThunk} from "../redux/profileSlice.ts"
import {Navigate } from "react-router-dom";

export function Loginpage() {

    // const [profile, setProfile] = useState({
    //     name : "",
    //     pfp : ""
    // })

    const dispatch = useAppDispatch()

    const { profile, loading, error  } = useAppSelector(state => state.auth)

    // const navigate = useNavigate()

    const handleLogin = async () => {
        try{

            dispatch(loginThunk())

            // const provider = new GoogleAuthProvider()
            // provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl")
            //
            // const res = await auth.signInWithPopup(provider)
            // const token = await res?.credential?.accessToken;
            // const user = res?.additionalUserInfo?.profile;
            //
            // setProfile({
            //     name : user?.name,
            //     pfp : user?.picture
            // })

            // console.log("res",res)
        }catch (error){
            console.log(error)
        }
    }

    if(profile) localStorage.setItem("profile", JSON.stringify(profile))

    return (
        <>
            <div>
                {profile ? <Navigate to="/home"/> :
                    <button onClick={ handleLogin }>Login</button>
                }
            </div>
        </>
    );
}