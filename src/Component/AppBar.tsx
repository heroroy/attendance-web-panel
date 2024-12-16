import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {useEffect , useState} from "react";
import {capitalizeWords} from "../Util/Naming_Conv.ts";
import {logoutThunk} from "../redux/profileSlice.ts";
import {useNavigate} from "react-router-dom";

const AppBar = ({ className } : { className: string}) => {
    const profile = useAppSelector(state => state.auth.profile)
    const [ popUp, setPopUp] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    function handleClick(){
        setPopUp(!popUp)
    }

    function handleLogout(){
        try {
            dispatch(logoutThunk())
            localStorage.setItem("user",JSON.stringify(null))
            navigate("/")
        }catch (e){
            console.log(e)
        }
    }

    return (
        <div className={className}>
            <div className=" border-b-2 border-b-gray-600 p-4 flex flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto ">
                    Attend
                    <span className="text-2xl text-blue-500 font-extrabold">Ease</span>
                </h3>
                {profile?.profilePic && <img onClick={handleClick} alt="profile" className="h-10 w-10 rounded-full justify-self-end mx-2" src={ profile.profilePic }/> }
            </div>
            {popUp && profile &&
                <div className="card z-30 px-5 pt-5 bg-gray-600  absolute right-5">
                    <div className="card-title flex flex-col">
                        <h6>{capitalizeWords(profile?.name)}</h6>
                        <p className="text-sm font-light">{profile?.email}</p>
                    </div>
                    <div className="card-body">
                        <button onClick={handleLogout} className="btn bg-slate-700">Logout</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default AppBar;