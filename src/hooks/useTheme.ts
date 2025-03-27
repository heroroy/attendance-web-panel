import {useEffect, useState} from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "winter")

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return {
        isDarkMode: theme === "night",
        toggleTheme: () => {
            const newTheme = theme === "winter" ? "night" : "winter";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        }
    }
}