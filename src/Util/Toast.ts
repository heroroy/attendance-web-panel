import {toast} from "react-toastify";

export default class Toast {

    static showInfo(message: string) {
        toast(message, {type: "info", theme: "colored", autoClose: 2000})
    }

    static showSuccess(message: string) {
        toast(message, {type: "success", theme: "colored", autoClose: 2000})
    }

    static showError(message: string | undefined | null) {
        toast(message, {type: "error", theme: "colored", autoClose: 2000})
    }
}