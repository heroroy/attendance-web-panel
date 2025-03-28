import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {useState} from "react";
import {capitalizeWords} from "../Util/Naming_Conv.ts";
import {logoutThunk} from "../redux/profileSlice.ts";
import {useNavigate} from "react-router-dom";
import logo from "../assets/rcc_logo.png"

const AppBar = ({className}: { className: string }) => {
    const profile = useAppSelector(state => state.auth.profile)
    const [popUp, setPopUp] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    function handleProfileClick() {
        setPopUp(!popUp)
    }

    function handleLogout() {
        try {
            dispatch(logoutThunk())
            setPopUp(false)
            navigate("/")
        } catch (e) {
            console.log(e)
        }
    }

    function handleTitleClick() {
        navigate("/home")
    }

    return (
        <div className={className}>
            <div className="border-b-2 border-b-primary border-opacity-15 p-4 flex justify-between flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto cursor-pointer flex items-center " onClick={handleTitleClick}>
                    <img height={25} width={25} className="me-4" src={logo}/>
                    RCCIIT Attend
                    <span className="text-2xl text-primary font-extrabold">Ease</span>
                </h3>
                {profile?.profilePic && <img onClick={handleProfileClick} alt="profile"
                                             className="h-10 w-10 rounded-full justify-self-end mx-2 cursor-pointer"
                                             src={profile.profilePic}/>}
            </div>
            {popUp && profile &&
                <div className="fixed inset-0 z-30 flex items-center justify-center"
                     aria-labelledby="modal-title"
                     role="dialog"
                     aria-modal="true">
                    <div className="fixed inset-0 bg-base-300 transition-opacity opacity-0"
                         onClick={() => setPopUp(false)} aria-hidden="true"></div>
                    <div
                        className="z-30 p-6 rounded-lg shadow-lg bg-base-300 top-16 absolute right-8 flex flex-col gap-8">
                        <div className="card-title flex flex-col">
                            <p className='text-base'>{capitalizeWords(profile?.name)}</p>
                            <p className="text-sm font-light mt-0">{profile?.email}</p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-primary btn-md">Logout</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default AppBar;