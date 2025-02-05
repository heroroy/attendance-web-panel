import {useEffect} from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function useClickOutside(ref, onClickOutside) {
    useEffect(() => {

        /**
         * Invoke Function onClick outside of element
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside();
            }
        }

        // Bind
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // dispose
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClickOutside]);
}