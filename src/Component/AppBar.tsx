import {useAppSelector} from "../redux/store.ts";

const AppBar = ({ className } : { className: string}) => {
    const profile = useAppSelector(state => state.auth.profile)


    return (
        <div className={className}>
            <div className=" border-b-2 border-b-gray-600 p-4 flex flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto ">
                    Attend
                    <span className="text-2xl text-blue-500 font-extrabold">Ease</span>
                </h3>
                {profile?.profilePic && <img alt="profile" className="h-10 w-10 rounded-full justify-self-end mx-2" src={ profile.profilePic }/> }
            </div>
        </div>
    );
};

export default AppBar;