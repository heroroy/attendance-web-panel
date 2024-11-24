import {useAppSelector} from "../redux/store.ts";

const AppBar = ({ className } : { className: string}) => {
    const profile = useAppSelector(state => state.auth.profile)
    return (
        <div className={className}>
            <div className="border-2 p-4 flex flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto ">
                    Attend
                    <span className="text-2xl text-blue-500 font-extrabold">Ease</span>
                </h3>
                <img className="h-10 w-10 rounded-full justify-self-end mx-2" src={profile?.profilePic}/>
            </div>
        </div>
    );
};

export default AppBar;