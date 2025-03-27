import {AiFillMoon, AiFillSun} from "react-icons/ai";
import useTheme from "../hooks/useTheme.ts";


const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <button
            className="btn btn-square btn-ghost"
            onClick={() => toggleTheme()}
        >
            {isDarkMode ? <AiFillSun size={24}/> : <AiFillMoon size={24}/>}
        </button>
    );
};

export default ThemeToggle;
