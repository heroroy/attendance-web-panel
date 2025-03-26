import {AiFillMoon, AiFillSun} from "react-icons/ai";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {themeSlice} from "../redux/themeSlice.ts";


const Toggle = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.theme);

    return (
        <button
            className="btn btn-square btn-ghost"
            onClick={() => dispatch(themeSlice.actions.toggleTheme())}
        >
            {theme === "night" ? <AiFillSun size={24}/> : <AiFillMoon size={24}/>}
        </button>
    );
};

export default Toggle;
