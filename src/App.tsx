import './index.css'
import {Loginpage} from "./Pages/loginpage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SubjectPage} from "./Pages/subjectPage.tsx";
import {HomePage} from "./Pages/HomePage.tsx";
import {useAppSelector} from "./redux/store.ts";
import AppBar from "./Component/AppBar.tsx";
import {ClassPage} from "./Pages/ClassPage.tsx";
import {ToastContainer} from "react-toastify";
import { SettingsPage } from './Pages/SettingsPage.tsx';

function Attendance() {

    const {profile} = useAppSelector(state => state.auth)

    return (
        <div className='w-screen h-screen flex flex-col items-center overflow-hidden'>
            <BrowserRouter>
                {profile != null && <AppBar className='w-full'/> }
                <div className='w-full p-20 flex flex-1 mb-5 flex-col items-center overflow-y-auto'>
                    <Routes>
                        <Route path="/" element={<Loginpage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/subject/:id" element={<SubjectPage/>}/>
                        <Route path="/class/:id" element={<ClassPage/>}/>
                        <Route path="/*" element={<HomePage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                    </Routes>
                </div>
                <ToastContainer className="z-50" position='bottom-right' stacked autoClose={2000}/>
            </BrowserRouter>
        </div>

    )
}

export default Attendance
